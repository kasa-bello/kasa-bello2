import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImageToSupabase } from "@/lib/storage/uploadUtils";

// Import the new component files
import { FileSelectionArea } from "./upload/FileSelectionArea";
import { SelectedFilesList } from "./upload/SelectedFilesList";
import { UploadStatusMessage } from "./upload/UploadStatusMessage";
import { UploadedImagesGallery } from "./upload/UploadedImagesGallery";
import { FileRequirementsInfo } from "./upload/FileRequirementsInfo";
import { UploadTip } from "./upload/UploadTip";

// Max file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const LocalImageImportTab = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadAttempts, setUploadAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detailedErrors, setDetailedErrors] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const handleFilesSelected = (newFiles: File[]) => {
    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
  };
  
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  const clearSelectedFiles = () => {
    setSelectedFiles([]);
  };
  
  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No files selected");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);
    setDetailedErrors([]);
    const newUploadedImages = [...uploadedImages];
    setUploadAttempts(prev => prev + 1);
    
    try {
      // Process each file
      const totalFiles = selectedFiles.length;
      const errors: string[] = [];
      let successCount = 0;
      
      for (let i = 0; i < totalFiles; i++) {
        const file = selectedFiles[i];
        
        // Update progress
        setUploadProgress(Math.round(((i) / totalFiles) * 100));
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          const errorMsg = `${file.name} is not an image file (type: ${file.type})`;
          errors.push(errorMsg);
          toast.error(errorMsg);
          continue;
        }
        
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          const errorMsg = `${file.name} exceeds maximum size of 10MB (${(file.size / (1024 * 1024)).toFixed(2)}MB)`;
          errors.push(errorMsg);
          toast.error(errorMsg);
          continue;
        }
        
        // Log file details to help with debugging
        console.log(`Uploading file: ${file.name}, size: ${(file.size / 1024).toFixed(2)}KB, type: ${file.type}`);
        
        // Try to upload the image
        try {
          const imageUrl = await uploadImageToSupabase(file);
          
          if (imageUrl) {
            console.log(`Successfully uploaded ${file.name}:`, imageUrl);
            newUploadedImages.push(imageUrl);
            successCount++;
            toast.success(`Uploaded ${file.name}`, {
              description: "Image has been added to your uploads"
            });
          } else {
            const errorMsg = `Failed to upload ${file.name} - the upload returned null`;
            console.error(errorMsg);
            errors.push(errorMsg);
            toast.error(errorMsg, {
              description: "Check console for details."
            });
          }
        } catch (fileError) {
          const errorMsg = `Error uploading ${file.name}: ${fileError instanceof Error ? fileError.message : "Unknown error"}`;
          console.error(errorMsg, fileError);
          errors.push(errorMsg);
          toast.error(`Error uploading ${file.name}`, {
            description: fileError instanceof Error ? fileError.message : "Unknown error"
          });
        }
      }
      
      setUploadProgress(100);
      setUploadedImages(newUploadedImages);
      
      if (errors.length > 0) {
        setDetailedErrors(errors);
        if (successCount === 0 && totalFiles > 0) {
          setErrorMessage("All uploads failed. Check the detailed errors below.");
        } else {
          setErrorMessage(`${errors.length} of ${totalFiles} files failed to upload.`);
        }
      }

      // Clear selected files after upload
      if (successCount > 0) {
        clearSelectedFiles();
      }
    } catch (error) {
      console.error("General error uploading files:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Local Image Upload</h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Upload images from your computer to use in your product listings.
        </p>
        
        <FileRequirementsInfo />
        
        <FileSelectionArea 
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          onFilesSelected={handleFilesSelected}
        />
      </div>
      
      <SelectedFilesList
        files={selectedFiles}
        isUploading={isUploading}
        onRemoveFile={removeSelectedFile}
        onClearFiles={clearSelectedFiles}
        onUploadFiles={handleBulkUpload}
      />
      
      <UploadStatusMessage
        errorMessage={errorMessage}
        detailedErrors={detailedErrors}
        uploadAttempts={uploadAttempts}
        uploadedImages={uploadedImages}
        isUploading={isUploading}
      />
      
      <UploadedImagesGallery images={uploadedImages} />
      
      <UploadTip />
    </div>
  );
};
