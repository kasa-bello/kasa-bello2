
import { useState, useEffect } from "react";
import { toast } from "sonner";

/**
 * Hook for validating images and managing their loading state
 * with improved error handling to prevent crashes
 */
export const useImageValidation = (images: string[]) => {
  const [loadErrors, setLoadErrors] = useState<{[key: number]: boolean}>({});
  const [filteredImages, setFilteredImages] = useState<string[]>([]);
  const [isValidatingImages, setIsValidatingImages] = useState(true);
  const [hasShownErrorToast, setHasShownErrorToast] = useState(false);
  
  // Default images to use if none are provided or all fail to load
  const defaultProductImages = [
    "/placeholder.svg"
  ];
  
  // Add some fallback product images if we need them
  const fallbackProductImages = [
    "/placeholder.svg"
  ];
  
  // Validate and sanitize input images to prevent crashes
  const sanitizeImages = (inputImages: any[]): string[] => {
    if (!Array.isArray(inputImages)) {
      console.warn('useImageValidation received non-array input:', inputImages);
      return defaultProductImages;
    }
    
    // Filter out invalid items and ensure all are strings
    return inputImages.filter(img => 
      img && 
      typeof img === 'string' && 
      img.trim() !== '' && 
      img !== '/placeholder.svg'
    );
  };
  
  // Filter out any empty or placeholder image URLs
  useEffect(() => {
    try {
      console.log("Initial images to validate:", images);
      
      // Sanitize input
      const validImages = sanitizeImages(images);
      
      console.log(`After filtering empty/placeholder URLs: ${validImages.length} images remain`);
      
      setFilteredImages(validImages.length > 0 ? validImages : defaultProductImages);
      
      // Reset errors when images change
      setLoadErrors({});
      setIsValidatingImages(true);
      setHasShownErrorToast(false);
    } catch (error) {
      console.error("Error in useImageValidation input processing:", error);
      setFilteredImages(defaultProductImages);
      setIsValidatingImages(false);
    }
  }, [images]);
  
  // Pre-validate all images to catch those that will fail
  useEffect(() => {
    if (!isValidatingImages || filteredImages.length === 0) return;
    
    const validateImages = async () => {
      const newErrors: {[key: number]: boolean} = {};
      let hasValidImages = false;

      console.log(`Starting validation of ${filteredImages.length} images`);

      // Create an array of promises for checking each image
      const imagePromises = filteredImages.map((src, index) => {
        return new Promise<void>((resolve) => {
          try {
            if (src === '/placeholder.svg') {
              resolve();
              return;
            }
            
            if (!src || typeof src !== 'string') {
              newErrors[index] = true;
              console.error(`Invalid image URL at index ${index}: ${src}`);
              resolve();
              return;
            }
            
            const img = new Image();
            
            // Set a timeout first to handle long loading times
            const timeoutId = setTimeout(() => {
              newErrors[index] = true;
              console.error(`Timeout: Image took too long to load: ${src}`);
              resolve();
            }, 5000);
            
            img.onload = () => {
              clearTimeout(timeoutId);
              console.log(`Image validated successfully: ${src}`);
              hasValidImages = true;
              resolve();
            };
            
            img.onerror = () => {
              clearTimeout(timeoutId);
              newErrors[index] = true;
              console.error(`Pre-validation: Image failed to load: ${src}`);
              resolve();
            };
            
            // Only set src after attaching event handlers
            img.src = src;
          } catch (loadError) {
            console.error(`Error during image validation for ${src}:`, loadError);
            newErrors[index] = true;
            resolve();
          }
        });
      });
      
      try {
        // Wait for all image validations to complete
        await Promise.all(imagePromises);
        
        console.log(`Validation complete. ${Object.keys(newErrors).length} of ${filteredImages.length} images failed`);
        
        setLoadErrors(newErrors);
        setIsValidatingImages(false);
        
        // If all images failed, use fallback images
        if (Object.keys(newErrors).length === filteredImages.length && filteredImages.length > 0) {
          console.log(`All ${filteredImages.length} images failed pre-validation, switching to fallbacks`);
          setFilteredImages(fallbackProductImages);
        }
      } catch (validationError) {
        console.error("Error during image validation:", validationError);
        setIsValidatingImages(false);
        // Use fallback images in case of error
        setFilteredImages(fallbackProductImages);
      }
    };
    
    validateImages();
  }, [filteredImages, isValidatingImages]);
  
  // Handle case where all provided images have load errors
  useEffect(() => {
    try {
      const errorCount = Object.keys(loadErrors).length;
      
      if (errorCount > 0 && errorCount === filteredImages.length && filteredImages.length > 0) {
        console.log(`All ${filteredImages.length} images failed to load, switching to fallbacks`);
        // All images failed to load, use fallback images
        setFilteredImages(fallbackProductImages);
        setLoadErrors({});
      }
    } catch (error) {
      console.error("Error handling load errors:", error);
    }
  }, [loadErrors, filteredImages.length]);

  // Notify user if all images failed (reduced to only notify once when validation is complete)
  useEffect(() => {
    try {
      if (!isValidatingImages && 
          !hasShownErrorToast &&
          Object.keys(loadErrors).length === filteredImages.length && 
          filteredImages.length > 0 && 
          filteredImages[0] !== '/placeholder.svg' &&
          filteredImages[0] !== fallbackProductImages[0]) {
        
        toast.error("Could not load product images", {
          description: "Please try refreshing the page or the product images may not exist in storage."
        });
        
        setHasShownErrorToast(true);
      }
    } catch (error) {
      console.error("Error in toast notification:", error);
    }
  }, [isValidatingImages, loadErrors, filteredImages, hasShownErrorToast]);

  return {
    filteredImages,
    loadErrors,
    isValidatingImages,
    defaultProductImages,
    fallbackProductImages
  };
};
