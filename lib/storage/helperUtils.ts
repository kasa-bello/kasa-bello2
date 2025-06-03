
// The bucket we created in Supabase
export const BUCKET_NAME = 'product-images';
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB size limit

// Check if we're in a browser environment
export const isBrowser = typeof window !== 'undefined';

/**
 * Check if a URL is a Dropbox sharing link and convert it to a direct download link if needed
 */
export const getDirectDownloadUrl = (url: string): string => {
  // Check if it's a Dropbox shared link
  if (url.includes('dropbox.com/s/') || url.includes('dropbox.com/scl/')) {
    // Convert to direct download link by replacing ?dl=0 with ?dl=1
    // or by adding ?dl=1 if it doesn't have a dl parameter
    if (url.includes('?dl=0')) {
      return url.replace('?dl=0', '?dl=1');
    } else if (!url.includes('?dl=')) {
      return `${url}${url.includes('?') ? '&' : '?'}dl=1`;
    }
  }
  return url;
};

/**
 * Get information about the Supabase storage buckets
 * Used for debugging storage issues
 */
export const getStorageInfo = async () => {
  try {
    if (!isBrowser) return { error: "Not in browser environment" };
    
    const { supabase } = await import('@/integrations/supabase/client');
    
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      return { error: bucketsError.message, details: bucketsError };
    }
    
    // Look for our target bucket
    const productBucket = buckets.find(b => b.name === BUCKET_NAME);
    
    if (!productBucket) {
      return { 
        error: `Bucket '${BUCKET_NAME}' not found`,
        buckets: buckets.map(b => b.name)
      };
    }
    
    // Try to list files in the bucket
    const { data: files, error: filesError } = await supabase.storage
      .from(BUCKET_NAME)
      .list();
      
    if (filesError) {
      return { 
        error: `Cannot list files in bucket: ${filesError.message}`,
        bucket: productBucket,
        details: filesError
      };
    }
    
    return {
      success: true,
      bucket: productBucket,
      files: files
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unknown error", details: e };
  }
};
