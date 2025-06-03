
import { updateProductImages } from './storage/uploadUtils';
import { toast } from 'sonner';

// Images provided for the specific product
const productImages = [
  '/lovable-uploads/b7a7d4ea-7fbb-42c0-a2ab-27e4cdeb681f.png',
  '/lovable-uploads/9222ff2b-8e39-4f2a-a6a9-0de2ed3533d8.png',
  '/lovable-uploads/f5ce525b-5aa2-4daf-b4fa-268376b29bf3.png',
  '/lovable-uploads/1a608718-c066-4d47-8be3-b21a6ee5a7c0.png',
  '/lovable-uploads/ce5f1e9d-375f-49d1-900b-46617f5baf39.png',
  '/lovable-uploads/3cdca130-61b1-4d1d-9405-d7a9c93e350c.png',
  '/lovable-uploads/82953d13-10e0-4e90-acb8-6d9c1b427368.png',
  '/lovable-uploads/b6c1da22-a65c-4ebd-8dcd-05b31e378738.png',
  '/lovable-uploads/0dff88e0-0b55-4a4d-b384-857ba94b0c10.png'
];

/**
 * Assign the provided images to product with SKU: ABS274
 * @param onProgress Optional callback for reporting progress
 * @returns Promise resolving to true if successful, false otherwise
 */
export const assignImagesToProduct = async (onProgress?: (progress: number) => void): Promise<boolean> => {
  try {
    // Show toast to indicate the process has started
    toast.info("Uploading images to product ABS274", {
      description: "This may take a few moments..."
    });
    
    // Update progress to 10% to show we've started
    onProgress?.(10);
    
    // Log the image paths we're attempting to upload
    console.log("Attempting to upload these images:", productImages);
    
    // Validate that image paths are correct
    if (productImages.some(path => !path.startsWith('/lovable-uploads/'))) {
      toast.error("Invalid image paths", {
        description: "Some image paths are invalid. They should start with '/lovable-uploads/'"
      });
      return false;
    }
    
    // Update progress to 20% to show we've validated
    onProgress?.(20);
    
    // First verify the product exists
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: product, error: productError } = await supabase
      .from('Products')
      .select('*')
      .eq('Sku', 'ABS274')
      .maybeSingle();
      
    if (productError || !product) {
      const errorMsg = productError ? productError.message : "Product not found";
      console.error(`Error verifying product ABS274: ${errorMsg}`);
      toast.error("Product verification failed", {
        description: "Could not find product with SKU: ABS274"
      });
      return false;
    }
    
    onProgress?.(30);
    
    // Call the updateProductImages function with the SKU and image URLs
    const result = await updateProductImages("ABS274", productImages);
    
    // Set progress to 100% if successful
    if (result) {
      onProgress?.(100);
      toast.success("Images uploaded successfully", {
        description: "The product images have been updated."
      });
    } else {
      toast.error("Failed to upload images", {
        description: "There was an error uploading the images."
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error in assignImagesToProduct:", error);
    toast.error("Error assigning images", {
      description: error instanceof Error ? error.message : "An unknown error occurred"
    });
    return false;
  }
};
