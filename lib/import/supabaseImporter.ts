
import { Product } from '../data';
import { supabase } from "@/integrations/supabase/client";
import { uploadMultipleImagesFromUrls } from '../storage/uploadUtils';
import { getDirectDownloadUrl } from '../storage/helperUtils';

// Function to import products to Supabase with image uploading
export const importProductsToSupabase = async (products: Product[]): Promise<number> => {
  let importedCount = 0;
  const errors: string[] = [];
  
  try {
    console.log(`Attempting to import ${products.length} products to Supabase`);
    
    for (const product of products) {
      try {
        // Process images if they exist
        let imageUrl = null;
        let imagesJson = null;
        
        if (product.images && product.images.length > 0) {
          try {
            // Get direct download URLs for Dropbox links
            const directUrls = product.images.map(url => getDirectDownloadUrl(url));
            
            // Upload images to Supabase
            const uploadedUrls = await uploadMultipleImagesFromUrls(directUrls);
            
            // Use the first uploaded image as the main image
            if (uploadedUrls.length > 0) {
              imageUrl = uploadedUrls[0];
              // Store all images as JSON string
              imagesJson = JSON.stringify(uploadedUrls);
            }
          } catch (imageError) {
            console.error(`Error processing images for product ${product.title}:`, imageError);
            errors.push(`Error with images for "${product.title}": ${imageError instanceof Error ? imageError.message : 'Unknown error'}`);
          }
        }
        
        // Prepare product data for Supabase
        const productData = {
          Sku: product.id,
          Title: product.title,
          "Short Description": product.description,
          "Selling price": product.price,
          "Regular Price": product.originalPrice || product.price,
          "Image URL": imageUrl,
          category: product.category,
          images: imagesJson, // Store all images as JSON string
        };
        
        console.log(`Inserting product into Supabase:`, productData);
        
        // Insert product into Supabase
        const { error } = await supabase.from("Products").insert(productData);
        
        if (error) {
          console.error("Error inserting product:", error);
          errors.push(`Failed to insert "${product.title}": ${error.message}`);
        } else {
          importedCount++;
          console.log(`Successfully imported product: ${product.title}`);
        }
      } catch (productError) {
        console.error(`Error processing product ${product.title}:`, productError);
        errors.push(`Error with product "${product.title}": ${productError instanceof Error ? productError.message : 'Unknown error'}`);
      }
    }
    
    // Log summary
    if (errors.length > 0) {
      console.warn(`Import completed with ${errors.length} errors. Imported ${importedCount} out of ${products.length} products.`);
      if (errors.length <= 5) {
        errors.forEach(err => console.error(err));
      } else {
        console.error(`First 5 errors: ${errors.slice(0, 5).join('; ')}...`);
      }
    } else {
      console.log(`Successfully imported all ${importedCount} products!`);
    }
    
    return importedCount;
  } catch (error) {
    console.error("Error in importProductsToSupabase:", error);
    throw error;
  }
};
