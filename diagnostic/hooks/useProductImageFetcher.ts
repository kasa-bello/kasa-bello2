
import { useState } from 'react';
import { fetchProductImages } from './services/productImageService';

/**
 * A hook for fetching product images to test their loading status
 */
export const useProductImageFetcher = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetch product images while managing loading state
   */
  const fetchImages = async (): Promise<string[]> => {
    setIsLoading(true);
    console.log("Starting to fetch product images for testing...");
    
    try {
      const images = await fetchProductImages();
      console.log(`Successfully fetched ${images.length} images`);
      
      // Log a sample of the images for debugging
      if (images.length > 0) {
        console.log("Sample image URLs:", images.slice(0, 5));
      }
      
      return images;
    } catch (error) {
      console.error("Error fetching product images:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchProductImages: fetchImages
  };
};
