
/**
 * Service for finding images by SKU
 * With improved reliability and error handling
 */

import { supabase } from '@/integrations/supabase/client';
import { extractImageUrls } from '../../utils/imageParsingUtils';

/**
 * Find image URLs for a specific product SKU with improved reliability
 */
export const findImagesBySku = async (sku: string): Promise<string[]> => {
  if (!sku || typeof sku !== 'string' || sku.trim() === '') {
    console.warn('findImagesBySku called with invalid SKU:', sku);
    return [];
  }
  
  const sanitizedSku = sku.trim();
  
  try {
    console.log(`Finding images for SKU: ${sanitizedSku}`);
    const urls: string[] = [];
    const processedUrls = new Set<string>(); // Track URLs we've already processed
    
    // 1. Try to find the product in the database first
    try {
      const { data: product, error: productError } = await supabase
        .from('Products')
        .select('*')
        .eq('Sku', sanitizedSku)
        .maybeSingle();
        
      if (productError) {
        console.error(`Error fetching product with SKU ${sanitizedSku}:`, productError);
      } else if (product) {
        console.log(`Found product with SKU ${sanitizedSku} in database`);
        // Extract images from the product
        const productUrls = extractImageUrls(product);
        if (productUrls.length > 0) {
          for (const url of productUrls) {
            if (!processedUrls.has(url)) {
              urls.push(url);
              processedUrls.add(url);
            }
          }
          console.log(`Extracted ${productUrls.length} URLs from product data for SKU ${sanitizedSku}`);
        }
      }
    } catch (productFetchError) {
      console.error(`Error fetching product with SKU ${sanitizedSku}:`, productFetchError);
    }
    
    // 2. Try direct storage URLs with various extensions
    try {
      const extensions = ['', '.jpg', '.jpeg', '.png', '.webp', '.gif'];
      
      for (const ext of extensions) {
        try {
          const publicUrl = supabase.storage
            .from('product-images')
            .getPublicUrl(`${sanitizedSku}${ext}`).data.publicUrl;
            
          if (!processedUrls.has(publicUrl)) {
            urls.push(publicUrl);
            processedUrls.add(publicUrl);
          }
        } catch (urlError) {
          console.error(`Error generating URL for SKU ${sanitizedSku} with extension ${ext}:`, urlError);
        }
      }
      
      // Also try lowercase variations
      const skuLower = sanitizedSku.toLowerCase();
      if (skuLower !== sanitizedSku) {
        for (const ext of extensions) {
          try {
            const publicUrl = supabase.storage
              .from('product-images')
              .getPublicUrl(`${skuLower}${ext}`).data.publicUrl;
              
            if (!processedUrls.has(publicUrl)) {
              urls.push(publicUrl);
              processedUrls.add(publicUrl);
            }
          } catch (urlError) {
            console.error(`Error generating URL for lowercase SKU ${skuLower} with extension ${ext}:`, urlError);
          }
        }
      }
    } catch (storageError) {
      console.error(`Error generating storage URLs for SKU ${sanitizedSku}:`, storageError);
    }
    
    // 3. Search the storage bucket for files matching the SKU
    try {
      // First check if bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      if (bucketError) {
        console.error(`Error checking buckets:`, bucketError);
      } else {
        const productImagesBucket = buckets.find(b => b.name === 'product-images');
        if (!productImagesBucket) {
          console.log(`'product-images' bucket not found. Creating fallback URLs only.`);
          
          // If bucket doesn't exist, we need to make sure users know it needs to be created
          console.error(`Product images bucket doesn't exist. Please create it in Supabase Storage.`);
        } else {
          // Try list with search (new Supabase feature)
          try {
            const { data: files, error: searchError } = await supabase
              .storage
              .from('product-images')
              .list('', { 
                search: sanitizedSku,
                sortBy: { column: 'name', order: 'asc' }
              });
              
            if (searchError) {
              console.error(`Error searching for files with SKU ${sanitizedSku}:`, searchError);
            } else if (files && files.length > 0) {
              console.log(`Found ${files.length} files matching SKU ${sanitizedSku} in storage`);
              
              for (const file of files) {
                // Skip folders
                if (file.name.endsWith('/')) continue;
                
                try {
                  const publicUrl = supabase.storage
                    .from('product-images')
                    .getPublicUrl(file.name).data.publicUrl;
                    
                  if (!processedUrls.has(publicUrl)) {
                    urls.push(publicUrl);
                    processedUrls.add(publicUrl);
                    console.log(`Added URL for file ${file.name}: ${publicUrl.substring(0, 60)}...`);
                  }
                } catch (urlError) {
                  console.error(`Error generating URL for file ${file.name}:`, urlError);
                }
              }
            } else {
              console.log(`No files found matching SKU ${sanitizedSku} with search`);
            }
          } catch (searchError) {
            console.error(`Error during storage search for SKU ${sanitizedSku}:`, searchError);
          }
        }
      }
    } catch (storageSearchError) {
      console.error(`Error searching storage for SKU ${sanitizedSku}:`, storageSearchError);
    }
    
    console.log(`Found ${urls.length} image URLs for SKU ${sanitizedSku}`);
    return urls;
  } catch (error) {
    console.error(`Error finding images for SKU ${sanitizedSku}:`, error);
    return [];
  }
};
