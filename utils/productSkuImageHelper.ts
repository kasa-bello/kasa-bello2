
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all possible image URLs for a specific SKU
 */
export const getPossibleImageUrlsForSku = (sku: string): string[] => {
  if (!sku || sku.length < 2) return [];
  
  const urls: string[] = [];
  const extensions = ['', '.jpg', '.jpeg', '.png', '.webp', '.gif'];
  
  // Generate URLs with different extensions
  for (const ext of extensions) {
    const publicUrl = supabase.storage
      .from('product-images')
      .getPublicUrl(`${sku}${ext}`).data.publicUrl;
      
    urls.push(publicUrl);
  }
  
  // Add variations in case of naming differences
  // Try lowercase
  const skuLower = sku.toLowerCase();
  if (skuLower !== sku) {
    for (const ext of extensions) {
      const publicUrl = supabase.storage
        .from('product-images')
        .getPublicUrl(`${skuLower}${ext}`).data.publicUrl;
        
      urls.push(publicUrl);
    }
  }
  
  // Try without separators if present
  const skuNoSeparators = sku.replace(/[-_]/g, '');
  if (skuNoSeparators !== sku) {
    for (const ext of extensions) {
      const publicUrl = supabase.storage
        .from('product-images')
        .getPublicUrl(`${skuNoSeparators}${ext}`).data.publicUrl;
        
      urls.push(publicUrl);
    }
  }
  
  // Try with common prefixes
  const prefixes = ['product-', 'img-', 'image-', 'pic-'];
  for (const prefix of prefixes) {
    for (const ext of extensions) {
      if (ext) { // Only add prefixes for actual extensions
        const publicUrl = supabase.storage
          .from('product-images')
          .getPublicUrl(`${prefix}${sku}${ext}`).data.publicUrl;
          
        urls.push(publicUrl);
      }
    }
  }
  
  return urls;
};

/**
 * Try to find the first valid image from a list of URLs
 * This tries to load each image until one succeeds
 */
export const findFirstValidImage = async (urls: string[]): Promise<string | null> => {
  if (!urls || urls.length === 0) return null;
  
  // A simple in-memory cache to avoid retrying failed URLs
  const failedUrls = new Set<string>();
  
  // Optimize by checking URLs in parallel (with a maximum limit to avoid too many connections)
  const MAX_PARALLEL = 5;
  const batches = [];
  
  for (let i = 0; i < urls.length; i += MAX_PARALLEL) {
    batches.push(urls.slice(i, i + MAX_PARALLEL));
  }
  
  for (const batch of batches) {
    // Filter out URLs we already know failed
    const urlsToCheck = batch.filter(url => !failedUrls.has(url));
    
    if (urlsToCheck.length === 0) continue;
    
    const results = await Promise.allSettled(
      urlsToCheck.map(url => 
        fetch(url, { 
          method: 'HEAD',
          // 3 second timeout to avoid hanging
          signal: AbortSignal.timeout(3000)
        })
          .then(response => ({ url, success: response.ok }))
          .catch(() => ({ url, success: false }))
      )
    );
    
    // Process results
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.success) {
        return result.value.url;
      } else if (result.status === 'fulfilled') {
        failedUrls.add(result.value.url);
      } else {
        // If promise was rejected, add URL to failed set
        const url = urlsToCheck[results.indexOf(result)];
        failedUrls.add(url);
      }
    }
  }
  
  return null;
};

/**
 * Load all images for a product SKU, checking them in parallel
 */
export const loadProductImagesBySku = async (sku: string): Promise<string[]> => {
  if (!sku || sku.length < 2) return [];
  
  try {
    // First check if files exist in storage with the exact SKU or variations
    const skuVariations = [
      sku,
      sku.toLowerCase(),
      sku.replace(/[-_]/g, ''),
      `product-${sku}`,
      `image-${sku}`
    ];
    
    let foundFiles: any[] = [];
    
    // Check each variation
    for (const skuVar of skuVariations) {
      if (foundFiles.length > 0) break; // Stop if we already found files
      
      const { data: files, error } = await supabase
        .storage
        .from('product-images')
        .list('', { search: skuVar });
        
      if (!error && files && files.length > 0) {
        // Filter out folders
        const imageFiles = files.filter(file => !file.name.endsWith('/'));
        if (imageFiles.length > 0) {
          foundFiles = imageFiles;
          console.log(`Found ${imageFiles.length} files for SKU variation ${skuVar}`);
          break;
        }
      }
    }
    
    // If we found files through search, return their URLs
    if (foundFiles.length > 0) {
      return foundFiles.map(file => 
        supabase.storage
          .from('product-images')
          .getPublicUrl(file.name).data.publicUrl
      );
    }
    
    // If no files found through search, list all files and try manual matching
    console.log(`No files found through search, listing all files for SKU ${sku}`);
    const { data: allFiles, error: listError } = await supabase
      .storage
      .from('product-images')
      .list('');
      
    if (listError) {
      console.error(`Error listing all files:`, listError);
    } else if (allFiles && allFiles.length > 0) {
      // Filter folders
      const imageFiles = allFiles.filter(file => !file.name.endsWith('/'));
      
      // Try a more flexible matching approach
      const matchingFiles = imageFiles.filter(file => {
        const fileName = file.name.toLowerCase();
        const skuLower = sku.toLowerCase();
        
        // Direct match
        if (fileName.includes(skuLower)) return true;
        
        // Match without separators
        if (fileName.replace(/[-_. ]/g, '').includes(skuLower.replace(/[-_]/g, ''))) return true;
        
        // Split filename and check parts for exact match
        const fileParts = fileName.split(/[-_. ]/);
        if (fileParts.some(part => part === skuLower)) return true;
        
        return false;
      });
      
      if (matchingFiles.length > 0) {
        console.log(`Found ${matchingFiles.length} matching files through manual filtering for SKU ${sku}`);
        return matchingFiles.map(file => 
          supabase.storage
            .from('product-images')
            .getPublicUrl(file.name).data.publicUrl
        );
      }
    }
    
    // As a last resort, try all possible URLs
    console.log(`No files found through listing, trying all possible URLs for SKU ${sku}`);
    const possibleUrls = getPossibleImageUrlsForSku(sku);
    
    // Check all URLs in parallel
    const results = await Promise.allSettled(
      possibleUrls.map(url => 
        fetch(url, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(3000) // 3 second timeout
        })
          .then(response => response.ok ? url : null)
          .catch(() => null)
      )
    );
    
    // Filter for valid URLs
    const validUrls = results
      .filter((result): result is PromiseFulfilledResult<string> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
    
    if (validUrls.length > 0) {
      console.log(`Found ${validUrls.length} valid image URLs for SKU ${sku}`);
      return validUrls;
    }
    
    console.log(`No valid image URLs found for SKU ${sku}`);
    return [];
  } catch (error) {
    console.error(`Error finding images for SKU ${sku}:`, error);
    return [];
  }
};
