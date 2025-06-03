
/**
 * Utilities for processing and validating image URLs
 */
import { supabase } from '@/integrations/supabase/client';

/**
 * Process a storage URL from Supabase to ensure it has the correct format
 * @param url URL to process
 * @returns Processed URL or placeholder if URL is missing
 */
export const processStorageUrl = (url: string | null | undefined): string => {
  if (!url) return '/placeholder.svg';
  
  // Remove leading/trailing whitespace
  const trimmedUrl = url.trim();
  if (trimmedUrl === '') return '/placeholder.svg';
  
  // If URL appears to be a local file path but doesn't start with /
  if (!trimmedUrl.startsWith('http://') && 
      !trimmedUrl.startsWith('https://') && 
      !trimmedUrl.startsWith('/')) {
    return `/${trimmedUrl}`;
  }
  
  return trimmedUrl;
};

/**
 * Check if a URL is valid and usable
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  const trimmedUrl = url.trim();
  return trimmedUrl !== '' && trimmedUrl !== '/placeholder.svg';
};

/**
 * Get public URL for a file in Supabase storage
 */
export const getSupabaseImageUrl = (fileName: string, bucket: string = 'product-images'): string => {
  return supabase.storage
    .from(bucket)
    .getPublicUrl(fileName).data.publicUrl;
};

/**
 * Generate potential image URLs for a SKU with different extensions
 */
export const generatePotentialImageUrls = (sku: string): string[] => {
  if (!sku) return [];
  
  const urls: string[] = [];
  const extensions = ['', '.jpg', '.jpeg', '.png', '.webp', '.gif'];
  
  for (const ext of extensions) {
    const publicUrl = getSupabaseImageUrl(`${sku}${ext}`);
    urls.push(publicUrl);
  }
  
  return urls;
};
