
import { useState } from 'react';
import { toast } from 'sonner';
import { useImageUrlTester, ImageUrlTestResult } from './useImageUrlTester';
import { useProductImageFetcher } from './useProductImageFetcher';

export type { ImageUrlTestResult };

export const useImageTesting = () => {
  const [isCheckingImages, setIsCheckingImages] = useState(false);
  const { testResults, testImageUrl, initializeTestResults } = useImageUrlTester();
  const { fetchProductImages } = useProductImageFetcher();

  /**
   * Test all product images
   */
  const testProductImages = async () => {
    setIsCheckingImages(true);
    
    try {
      // Fetch unique URLs 
      const urls = await fetchProductImages();
      
      if (urls.length === 0) {
        toast.warning("No product images found", {
          description: "Could not find any product images to test"
        });
        return false;
      }
      
      // Initialize test results and get unique URLs
      const uniqueUrls = initializeTestResults(urls);
      
      // Test each URL in parallel and collect results
      const results = await Promise.all(
        uniqueUrls.map((url, index) => testImageUrl(url, index))
      );
      
      // Count successful tests
      const successCount = results.filter(Boolean).length;
      
      console.log("Image test results:", {
        total: uniqueUrls.length,
        success: successCount,
        results: testResults.map(r => ({ url: r.url, status: r.status, error: r.error }))
      });
      
      // Show appropriate toast based on results
      if (successCount === 0 && uniqueUrls.length > 0) {
        toast.error("All image tests failed", {
          description: "None of the product images could be loaded"
        });
      } else if (successCount < uniqueUrls.length && uniqueUrls.length > 0) {
        toast.warning("Some image tests failed", {
          description: `${successCount} of ${uniqueUrls.length} images loaded successfully`
        });
      } else if (uniqueUrls.length > 0) {
        toast.success("All image tests passed", {
          description: `${successCount} images loaded successfully`
        });
      }
      
      return successCount > 0;
    } catch (error) {
      console.error("Error testing product images:", error);
      toast.error("Testing error", {
        description: error instanceof Error ? error.message : "Unknown error running image tests"
      });
      return false;
    } finally {
      setIsCheckingImages(false);
    }
  };

  return {
    isCheckingImages,
    testResults,
    testProductImages
  };
};
