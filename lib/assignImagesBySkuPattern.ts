
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

/**
 * Match images to products based on SKU patterns in the filenames
 * This function assumes images have SKUs embedded in their filenames
 */
export const assignImagesBySkuPattern = async (
  onProgress?: (progress: number) => void
): Promise<boolean> => {
  try {
    // Show toast to indicate the process has started
    toast.info("Matching images to products by SKU", {
      description: "This may take a few moments..."
    });
    
    // Update progress to start
    onProgress?.(5);
    
    // Check if the product-images bucket exists, if not, create it
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.error("Error checking storage buckets:", bucketError);
      toast.error("Failed to check storage buckets");
      return false;
    }
    
    const productImagesBucketExists = buckets?.some(bucket => bucket.name === 'product-images');
    
    if (!productImagesBucketExists) {
      console.log("Creating 'product-images' bucket");
      const { error: createBucketError } = await supabase.storage.createBucket('product-images', {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createBucketError) {
        console.error("Error creating 'product-images' bucket:", createBucketError);
        toast.error("Failed to create storage bucket");
        return false;
      }
    }
    
    // First, fetch all products
    const { data: products, error: fetchError } = await supabase
      .from("Products")
      .select("Sku, Title");
    
    if (fetchError) {
      console.error("Error fetching products:", fetchError);
      toast.error("Failed to fetch products");
      return false;
    }
    
    if (!products || products.length === 0) {
      toast.error("No products found in the database");
      return false;
    }
    
    console.log(`Found ${products.length} products to process`);
    onProgress?.(20);
    
    // Get all uploaded images from storage
    const { data: imageObjects, error: imageError } = await supabase.storage
      .from('product-images')
      .list();
    
    if (imageError) {
      console.error("Error listing images:", imageError);
      toast.error("Failed to list images");
      return false;
    }
    
    if (!imageObjects || imageObjects.length === 0) {
      toast.error("No images found in storage");
      return false;
    }
    
    console.log(`Found ${imageObjects.length} images to process`);
    onProgress?.(30);
    
    // Create a mapping of SKUs to images
    const skuToImagesMap = new Map<string, string[]>();
    
    // First, preprocess products to have clean SKUs for matching
    const productSkus = products.map(product => ({
      sku: product.Sku,
      title: product.Title,
      skuLower: product.Sku.toLowerCase(),
      skuNoSeparators: product.Sku.replace(/[-_]/g, ''),
      skuParts: product.Sku.split(/[-_]/)
    }));
    
    // Process each image and match with SKUs
    for (const imageObj of imageObjects) {
      // Skip folders/directories
      if (imageObj.name.endsWith('/')) continue;
      
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(imageObj.name);
      
      const imageUrl = data.publicUrl;
      
      // Extract possible SKU from filename using multiple strategies
      const filename = imageObj.name;
      const filenameLower = filename.toLowerCase();
      const filenameNoSeparators = filename.replace(/[-_. ]/g, '');
      const filenameParts = filename.split(/[-_. ]/);
      
      console.log(`Processing image: ${filename}`);
      
      // Try to match each product SKU with the filename
      let matched = false;
      
      for (const product of productSkus) {
        // Skip products with very short SKUs (to avoid false matches)
        if (product.sku.length < 3) continue;
        
        // Strategies to match SKU with filename
        const isMatch = 
          // Direct matches
          filename.includes(product.sku) || 
          filenameLower.includes(product.skuLower) ||
          
          // No separator matches
          filenameNoSeparators.includes(product.skuNoSeparators) ||
          
          // Part matches - if all parts of SKU are in the filename
          product.skuParts.length > 1 && product.skuParts.every(part => filename.includes(part)) ||
          
          // Direct part match - if SKU is one of the parts of the filename
          filenameParts.some(part => part === product.sku);
        
        if (isMatch) {
          if (!skuToImagesMap.has(product.sku)) {
            skuToImagesMap.set(product.sku, []);
          }
          skuToImagesMap.get(product.sku)?.push(imageUrl);
          console.log(`✓ Matched image ${imageObj.name} with product ${product.sku} (${product.title || 'No Title'})`);
          matched = true;
          break; // Once we find a match, move to the next image
        }
      }
      
      if (!matched) {
        console.log(`✗ No SKU match found for image: ${filename}`);
      }
    }
    
    onProgress?.(50);
    
    console.log(`Matched images for ${skuToImagesMap.size} products`);
    
    // Update each product with its matched images
    let successCount = 0;
    let index = 0;
    const totalToUpdate = skuToImagesMap.size;
    
    for (const [sku, imageUrls] of skuToImagesMap.entries()) {
      // Update progress
      onProgress?.(50 + Math.floor((index / totalToUpdate) * 50));
      index++;
      
      if (imageUrls.length === 0) continue;
      
      // Create a JSON array of the image URLs
      const imagesJson = JSON.stringify(imageUrls);
      
      // Use a custom object for the update to avoid TypeScript errors
      const updateData: Record<string, any> = {
        "Images": imagesJson,  // Store all matched images as a JSON array
        "Image URL": imageUrls[0]  // Use the first matched image as main image
      };
      
      console.log(`Updating product ${sku} with ${imageUrls.length} images. Main image: ${imageUrls[0]}`);
      
      // Update the product with these images
      const { error: updateError } = await supabase
        .from("Products")
        .update(updateData)
        .eq("Sku", sku);
      
      if (updateError) {
        console.error(`Error updating product ${sku}:`, updateError);
        continue;
      }
      
      successCount++;
      console.log(`Updated product ${sku} with ${imageUrls.length} matching images`);
    }
    
    // Set progress to 100% when done
    onProgress?.(100);
    
    if (successCount === 0) {
      toast.error("No products were updated with images");
      return false;
    }
    
    toast.success(`Successfully matched images to ${successCount} products`, {
      description: `${skuToImagesMap.size - successCount} products failed to update`
    });
    
    return true;
  } catch (error) {
    console.error("Error in assignImagesBySkuPattern:", error);
    toast.error("Error matching images", {
      description: error instanceof Error ? error.message : "An unknown error occurred"
    });
    return false;
  }
};
