
/**
 * Service for fetching and extracting all product images
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '@/types/product.types';
import { updateProductCategories } from '../productCategoryService';
import { findImagesBySku } from './findImagesBySku';
import { fetchStorageFiles, generatePublicUrls } from './fetchStorageFiles';
import { matchSkuWithFiles } from './matchSkuWithFiles';
import { 
  getProductsWithDirectUrls, 
  getProductsWithImagesField,
  extractDirectImageUrls,
  extractAllProductImageUrls
} from './productExtractor';

/**
 * Fetch product images from the database
 */
export const fetchProductImages = async (): Promise<string[]> => {
  try {
    // First, update product categories if they're missing
    await updateProductCategories();
    
    // Fetch product data to test images
    const { data, error: productsError } = await supabase
      .from('Products')
      .select('*')
      .limit(100); // Increase limit to get more products for testing
      
    if (productsError) {
      console.error("Error fetching products:", productsError);
      toast.error("Error fetching products", {
        description: productsError.message
      });
      return [];
    }
    
    // Explicitly cast data to Product[] and ensure it's an array before iterating
    const products = data as Product[] | null;
    
    // Extract image URLs to test
    const urls: string[] = [];
    
    // Ensure products is an array before iterating
    if (products && Array.isArray(products)) {
      console.log(`Processing ${products.length} products for image URLs`);
      
      // Check for direct image URLs in the 'Image URL' field
      const productsWithDirectUrls = getProductsWithDirectUrls(products);
      console.log(`Found ${productsWithDirectUrls.length} products with direct Image URL data`);
      
      // Check for Images field (JSON string or array)
      const productsWithImagesField = getProductsWithImagesField(products);
      console.log(`Found ${productsWithImagesField.length} products with Images field data`);
      
      // Add direct URLs to the list first
      const directUrls = extractDirectImageUrls(productsWithDirectUrls);
      urls.push(...directUrls);
      
      // Get files directly from storage as a primary source
      const storageResult = await fetchStorageFiles();
      
      if (storageResult) {
        const { files: storageFiles } = storageResult;
        
        // Generate public URLs for all files
        const storageUrls = generatePublicUrls(storageFiles);
        
        // Only add storage URLs that don't already exist in the list
        const newStorageUrls = storageUrls.filter(url => !urls.includes(url));
        urls.push(...newStorageUrls);
        
        console.log(`Added ${newStorageUrls.length} public URLs from storage files`);
        
        // Match SKUs with storage files for products that don't have images yet
        if (storageFiles.length > 0) {
          const skuMatchedUrls = matchSkuWithFiles(products, storageFiles);
          
          // Only add SKU-matched URLs that don't already exist in the list
          const newSkuUrls = skuMatchedUrls.filter(url => !urls.includes(url));
          urls.push(...newSkuUrls);
          
          console.log(`Added ${newSkuUrls.length} SKU-matched URLs`);
        }
      }
      
      // Process each product to extract all possible image URLs
      const allProductUrls = extractAllProductImageUrls(products);
      
      // Only add product URLs that don't already exist in the list
      const newProductUrls = allProductUrls.filter(url => !urls.includes(url));
      urls.push(...newProductUrls);
      
      console.log(`Added ${newProductUrls.length} URLs from product data`);
    }
    
    console.log(`Found ${urls.length} total image URLs to test`);
    
    // Pre-validate URLs to remove obvious non-existent storage references
    const validatedUrls = urls.filter(url => {
      // Filter out empty URLs
      if (!url || url.trim() === '') return false;
      
      // Filter out storage URLs for non-existent SKUs
      if (url.includes('supabase.co/storage') && 
          url.includes('product-images') && 
          !url.includes('.')) {
        
        // Get the SKU from the URL
        const urlParts = url.split('/');
        const potentialSku = urlParts[urlParts.length - 1];
        
        // If the SKU is very short, it's likely not valid
        if (potentialSku.length < 3) return false;
      }
      
      return true;
    });
    
    console.log(`After validation, keeping ${validatedUrls.length} out of ${urls.length} URLs`);
    
    // Return unique URLs without empty strings
    return [...new Set(validatedUrls)].filter(url => url && url.trim() !== '');
  } catch (e) {
    console.error("Error fetching product images:", e);
    return [];
  }
};
