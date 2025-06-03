
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useState, useEffect } from "react";

interface ImageGalleryMainProps {
  currentImage: number;
  currentImageHasError: boolean;
  filteredImages: string[];
  title: string;
  handleImageError: (index: number) => void;
  goToPrevious: () => void;
  goToNext: () => void;
  validThumbnailsCount: number;
}

export const ImageGalleryMain = ({
  currentImage,
  currentImageHasError,
  filteredImages,
  title,
  handleImageError,
  goToPrevious,
  goToNext,
  validThumbnailsCount
}: ImageGalleryMainProps) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Reset loading state when current image changes
  useEffect(() => {
    setIsLoading(true);
    setRetryCount(0); // Reset retry count for new image
  }, [currentImage]);
  
  // Function to retry loading the current image
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      
      // Create a new URL with a cache-busting parameter
      const img = new Image();
      const cacheBuster = Date.now();
      const imgSrc = filteredImages[currentImage];
      const newSrc = imgSrc.includes('?') 
        ? `${imgSrc}&cache=${cacheBuster}` 
        : `${imgSrc}?cache=${cacheBuster}`;
      
      console.log(`Retrying image load (attempt ${retryCount + 1}): ${newSrc}`);
      
      // Preload the image
      img.onload = () => {
        // Force a re-render with the new cache-busted URL
        const imgElement = document.getElementById('main-product-image') as HTMLImageElement;
        if (imgElement) {
          imgElement.src = newSrc;
          setIsLoading(false);
        }
      };
      
      img.onerror = () => {
        console.error(`Retry failed (attempt ${retryCount + 1}): ${newSrc}`);
        setIsLoading(false);
      };
      
      img.src = newSrc;
    }
  };
  
  // Check if the image is from Supabase storage
  const isSupabaseStorageImage = filteredImages[currentImage]?.includes('supabase.co/storage');
  
  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      {/* Main image display */}
      {currentImageHasError ? (
        <div className="w-full h-[400px] md:h-[500px] flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
          <ImageOff className="h-16 w-16 mb-4" />
          <p className="text-center mb-2">Image could not be loaded</p>
          {retryCount < 3 && (
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Retry
            </button>
          )}
          {isSupabaseStorageImage && (
            <p className="text-center text-xs mt-4 max-w-md px-4">
              Note: This image link is from Supabase Storage. Make sure the product-images bucket exists 
              and contains this image file.
            </p>
          )}
        </div>
      ) : (
        <div className="relative w-full h-[400px] md:h-[500px] bg-white dark:bg-gray-900">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          <img 
            id="main-product-image"
            src={filteredImages[currentImage]} 
            alt={title} 
            className="w-full h-full object-contain"
            onError={() => handleImageError(currentImage)}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      )}
      
      {/* Navigation arrows - only show if more than one image */}
      {validThumbnailsCount > 1 && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
        </>
      )}
      
      {/* Image counter */}
      {validThumbnailsCount > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {currentImage + 1} / {filteredImages.length}
        </div>
      )}
    </div>
  );
};
