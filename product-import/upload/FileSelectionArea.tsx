import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, FolderOpen } from "lucide-react";
import { getStorageInfo, BUCKET_NAME } from "@/lib/storage/helperUtils";
import { toast } from "sonner";

interface FileSelectionAreaProps {
  isUploading: boolean;
  uploadProgress: number;
  onFilesSelected: (files: File[]) => void;
}

export const FileSelectionArea = ({ 
  isUploading, 
  uploadProgress, 
  onFilesSelected 
}: FileSelectionAreaProps) => {
  
  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    onFilesSelected(fileArray);
    
    // Reset the input
    event.target.value = "";
  };

  const checkStorageStatus = async () => {
    try {
      toast.info("Checking storage configuration...");
      const info = await getStorageInfo();
      
      if (info.error) {
        console.error("Storage diagnostic error:", info);
        toast.error("Storage configuration issue", {
          description: info.error
        });
        return;
      }
      
      toast.success("Storage is configured correctly", {
        description: `Found ${info.files?.length || 0} files in the ${BUCKET_NAME} bucket`
      });
    } catch (e) {
      console.error("Error checking storage:", e);
      toast.error("Error checking storage configuration");
    }
  };

  return (
    <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
      <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
      <p className="mb-4 font-medium">Drag and drop your image files or folders, or click to browse</p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <label className="relative">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelection}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Button disabled={isUploading} variant="outline">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>Select Files</>
            )}
          </Button>
        </label>
        
        <label className="relative">
          <input
            type="file"
            {...{
              webkitdirectory: "true",
              directory: ""
            } as any}
            multiple
            onChange={handleFileSelection}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Button disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <FolderOpen className="mr-2 h-4 w-4" />
                Select Folder
              </>
            )}
          </Button>
        </label>
      </div>
      
      <div className="mt-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={checkStorageStatus}
          type="button"
        >
          Diagnose Storage Issues
        </Button>
      </div>
    </div>
  );
};
