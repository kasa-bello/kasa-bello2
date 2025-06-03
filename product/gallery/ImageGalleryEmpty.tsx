
import { ImageOff } from "lucide-react";

export const ImageGalleryEmpty = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px] flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
      <ImageOff className="h-16 w-16 mb-4" />
      <p className="text-center">No product images available</p>
    </div>
  );
};
