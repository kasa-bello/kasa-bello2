import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DownloadCloud } from "lucide-react";
import { uploadImageFromUrl } from "@/lib/storage/uploadUtils";
import { getDirectDownloadUrl } from "@/lib/storage/helperUtils";

export const DropboxImageImportTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dropboxUrl, setDropboxUrl] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  
  const handleImageUrlUpload = async () => {
    if (!dropboxUrl.trim()) {
      toast.error("Please enter a Dropbox URL");
      return;
    }
    
    setIsLoading(true);
    try {
      // Convert to direct download URL if it's a Dropbox link
      const directUrl = getDirectDownloadUrl(dropboxUrl);
      
      // Upload the image to Supabase storage
      const imageUrl = await uploadImageFromUrl(directUrl);
      
      if (imageUrl) {
        setUploadedImageUrl(imageUrl);
        toast.success("Image uploaded successfully", {
          description: "The image has been uploaded to Supabase storage"
        });
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed", {
        description: error instanceof Error ? error.message : "Failed to upload image"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dropbox Image Import</h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Enter a Dropbox image URL to upload it to Supabase storage.
        </p>
        
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="dropbox-url" className="text-sm font-medium">
              Dropbox Image URL
            </label>
            <Input
              id="dropbox-url"
              type="url"
              placeholder="https://www.dropbox.com/s/example/image.jpg"
              value={dropboxUrl}
              onChange={(e) => setDropboxUrl(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleImageUrlUpload} 
            disabled={isLoading || !dropboxUrl.trim()}
            className="w-full"
          >
            {isLoading ? "Uploading..." : "Upload Image to Supabase"}
          </Button>
        </div>
      </div>
      
      {uploadedImageUrl && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Uploaded Image:</h3>
          <div className="border rounded-md p-2 bg-gray-50 dark:bg-gray-900">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
              <img 
                src={uploadedImageUrl} 
                alt="Uploaded product" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 break-all">
                {uploadedImageUrl}
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-2 w-full"
                onClick={() => {
                  navigator.clipboard.writeText(uploadedImageUrl);
                  toast.success("Image URL copied to clipboard");
                }}
              >
                Copy URL
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded text-blue-800 dark:text-blue-300">
        <h3 className="font-medium mb-2">Tip:</h3>
        <p className="text-sm">
          To use these images in your CSV import, copy the Supabase URL after uploading and include it in the "images" column.
        </p>
      </div>
    </div>
  );
};
