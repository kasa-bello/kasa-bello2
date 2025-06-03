
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface UploadedImagesGalleryProps {
  images: string[];
}

export const UploadedImagesGallery = ({ images }: UploadedImagesGalleryProps) => {
  if (images.length === 0) return null;

  const copyImageUrlToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Image URL copied to clipboard");
  };
  
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-3">Uploaded Images: {images.length}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="border rounded-md overflow-hidden bg-gray-50 dark:bg-gray-900">
            <AspectRatio ratio={1}>
              <img 
                src={imageUrl} 
                alt={`Uploaded image ${index + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(`Failed to load image: ${imageUrl}`);
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </AspectRatio>
            <div className="p-2">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full text-xs"
                onClick={() => copyImageUrlToClipboard(imageUrl)}
              >
                <CheckCircle className="mr-1 h-3 w-3" />
                Copy URL
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
