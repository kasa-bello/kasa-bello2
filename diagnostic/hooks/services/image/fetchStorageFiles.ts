
/**
 * Service for fetching files from Supabase storage
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch files from the product-images bucket in Supabase storage
 */
export const fetchStorageFiles = async (): Promise<{ files: any[], count: number } | null> => {
  try {
    const { data: bucketFiles, error: bucketError } = await supabase
      .storage
      .from('product-images')
      .list('', {
        limit: 1000, // Get up to 1000 files
        sortBy: { column: 'name', order: 'asc' }
      });
      
    if (bucketError) {
      console.error("Error listing bucket files:", bucketError);
      return null;
    }
    
    if (bucketFiles && bucketFiles.length > 0) {
      console.log(`Found ${bucketFiles.length} files in product-images bucket`);
      return { files: bucketFiles, count: bucketFiles.length };
    }
    
    return { files: [], count: 0 };
  } catch (e) {
    console.error("Error accessing storage bucket:", e);
    return null;
  }
};

/**
 * Generate public URLs for storage files
 */
export const generatePublicUrls = (files: any[]): string[] => {
  const urls: string[] = [];
  
  for (const file of files) {
    // Skip directory entries
    if (!file.name || file.name.endsWith('/')) continue;
    
    const publicUrl = supabase.storage
      .from('product-images')
      .getPublicUrl(file.name).data.publicUrl;
      
    urls.push(publicUrl);
  }
  
  return urls;
};
