
import { useState, useEffect } from "react";
import { ImageGalleryMain } from "./ImageGalleryMain";
import { ImageGalleryThumbnails } from "./ImageGalleryThumbnails";
import { ImageGalleryEmpty } from "./ImageGalleryEmpty";
import { ImageGalleryLoading } from "./ImageGalleryLoading";
import { useImageValidation } from "@/hooks/useImageValidation";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export const ProductImageGallery = ({ images, title }: ProductImageGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const {
    filteredImages,
    loadErrors,
    isValidatingImages,
    defaultProductImages
  } = useImageValidation(images);
  
  // Navigation handlers
  const goToPrevious = () => {
    setCurrentImage(current => (current === 0 ? filteredImages.length - 1 : current - 1));
  };
  
  const goToNext = () => {
    setCurrentImage(current => (current === filteredImages.length - 1 ? 0 : current + 1));
  };

  // Handle image error
  const handleImageError = (index: number) => {
    console.error(`Image failed to load: ${filteredImages[index]}`);
    
    // If current image failed, try to move to next non-failed image
    if (index === currentImage) {
      let nextIndex = currentImage;
      let attempts = 0;
      while (attempts < filteredImages.length) {
        nextIndex = (nextIndex + 1) % filteredImages.length;
        if (!loadErrors[nextIndex]) {
          setCurrentImage(nextIndex);
          break;
        }
        attempts++;
      }
    }
  };
  
  // Show loading state while validating images
  if (isValidatingImages) {
    return <ImageGalleryLoading />;
  }
  
  // If no images available, show empty state
  if (filteredImages.length === 0) {
    return <ImageGalleryEmpty />;
  }
  
  // Check if the current image has errored
  const currentImageHasError = loadErrors[currentImage];
  
  // Filter out errored images for the thumbnails
  const validThumbnails = filteredImages.filter((_, index) => !loadErrors[index]);
  
  return (
    <div className="space-y-4">
      <ImageGalleryMain
        currentImage={currentImage}
        currentImageHasError={currentImageHasError}
        filteredImages={filteredImages}
        title={title}
        handleImageError={handleImageError}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
        validThumbnailsCount={validThumbnails.length}
      />
      
      {/* Thumbnail navigation - only show if more than one valid image */}
      {validThumbnails.length > 1 && (
        <ImageGalleryThumbnails
          filteredImages={filteredImages}
          loadErrors={loadErrors}
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
          handleImageError={handleImageError}
        />
      )}
    </div>
  );
};
