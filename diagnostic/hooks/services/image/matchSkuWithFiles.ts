
/**
 * Service for matching product SKUs with storage files
 */

import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product.types';

/**
 * Match product SKUs with storage files with improved matching algorithm
 * and better error handling to prevent crashes
 */
export const matchSkuWithFiles = (products: Product[], storageFiles: any[]): string[] => {
  const urls: string[] = [];
  const matchingDetails: {sku: string, file: string, url: string}[] = [];
  const processedFiles = new Set<string>(); // Track files we've already processed
  
  if (!Array.isArray(products) || products.length === 0) {
    console.log('No products to match with files');
    return [];
  }
  
  if (!Array.isArray(storageFiles) || storageFiles.length === 0) {
    console.log('No storage files to match with products');
    return [];
  }
  
  try {
    // Filter out invalid storage files first
    const validStorageFiles = storageFiles.filter(file => {
      return file && typeof file === 'object' && file.name && typeof file.name === 'string' && !file.name.endsWith('/');
    });
    
    console.log(`Matching ${products.length} products with ${validStorageFiles.length} valid storage files`);
    
    // Process each product
    for (const product of products) {
      try {
        const sku = product.Sku;
        if (!sku || typeof sku !== 'string' || sku.trim() === '') continue;
        
        // Multiple matching strategies with improved naming
        const skuLower = sku.toLowerCase();
        const skuWithoutSeparators = sku.replace(/[-_. ]/g, '');
        const skuParts = sku.split(/[-_. ]/);
        
        // Create test URLs with common extensions to check directly
        const testExtensions = ['', '.jpg', '.jpeg', '.png', '.webp', '.gif'];
        for (const ext of testExtensions) {
          const testUrl = supabase.storage
            .from('product-images')
            .getPublicUrl(`${sku}${ext}`).data.publicUrl;
            
          // Add URL to results if not already included
          if (testUrl && !urls.includes(testUrl)) {
            urls.push(testUrl);
            matchingDetails.push({
              sku: sku,
              file: `${sku}${ext}`,
              url: testUrl
            });
          }
        }
        
        // Look for files with SKU in the name using different matching strategies
        const matchingFiles = validStorageFiles.filter(file => {
          try {
            const fileName = file.name;
            if (!fileName || typeof fileName !== 'string' || fileName.endsWith('/')) return false;
            
            const fileNameLower = fileName.toLowerCase();
            const fileNameWithoutSeparators = fileName.replace(/[-_. ]/g, '');
            const fileNameParts = fileName.split(/[-_. ]/);
            
            // Direct match
            if (fileName.includes(sku)) return true;
            
            // Case insensitive match
            if (fileNameLower.includes(skuLower)) return true;
            
            // Match without separators
            if (fileNameWithoutSeparators.includes(skuWithoutSeparators)) return true;
            
            // Match as standalone word (surrounded by separators or start/end of string)
            if (fileNameParts.some(part => part === sku)) return true;
            
            // For short SKUs (3+ chars), more careful matching to avoid false positives
            if (sku.length >= 3) {
              // If a multi-part SKU, check if all parts appear in the filename
              if (skuParts.length > 1) {
                return skuParts.every(part => fileName.includes(part));
              }
              
              // Additional check: if SKU is in filename and followed by common image extensions
              const commonExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
              return commonExtensions.some(ext => fileName === `${sku}${ext}` || fileName.startsWith(`${sku}-`) || fileName.startsWith(`${sku}_`));
            }
            
            return false;
          } catch (fileMatchError) {
            console.error(`Error matching file ${file?.name || 'unknown'} with SKU ${sku}:`, fileMatchError);
            return false;
          }
        });
        
        if (matchingFiles.length > 0) {
          for (const file of matchingFiles) {
            try {
              // Skip if we've already processed this file to avoid duplicates
              if (processedFiles.has(file.name)) continue;
              processedFiles.add(file.name);
              
              // Generate public URL and verify it's valid
              const publicUrl = supabase.storage
                .from('product-images')
                .getPublicUrl(file.name).data.publicUrl;
              
              if (!publicUrl || typeof publicUrl !== 'string' || publicUrl.trim() === '') {
                console.error(`Invalid public URL for file ${file.name}`);
                continue;
              }
              
              // Add to urls if not already included
              if (!urls.includes(publicUrl)) {
                urls.push(publicUrl);
                matchingDetails.push({
                  sku: sku,
                  file: file.name,
                  url: publicUrl
                });
              }
            } catch (urlError) {
              console.error(`Error generating URL for file ${file.name}:`, urlError);
            }
          }
        }
      } catch (productError) {
        console.error(`Error processing product ${product.Sku || 'unknown'}:`, productError);
      }
    }
  } catch (mainError) {
    console.error('Unexpected error in matchSkuWithFiles:', mainError);
  }
  
  // Log details of matches for debugging
  console.log(`Matched ${matchingDetails.length} SKUs with files:`, 
    matchingDetails.slice(0, 5).map(d => `${d.sku} -> ${d.file}`));
  
  // Validate URLs before returning
  const validUrls = urls.filter(url => url && typeof url === 'string' && url.trim() !== '');
  console.log(`Returning ${validUrls.length} valid URLs out of ${urls.length} total matches`);
  
  return validUrls;
};
