
/**
 * Utilities for looking up images in Supabase storage
 */
import { supabase } from '@/integrations/supabase/client';
import { getSupabaseImageUrl } from './urlProcessor';

/**
 * Check if a product SKU matches a file in Supabase storage
 */
export const findImageBySku = async (sku: string): Promise<string | null> => {
  if (!sku) return null;
  
  try {
    // Try direct match first (SKU.jpg, SKU.png, etc)
    const { data: matchingFiles, error } = await supabase
      .storage
      .from('product-images')
      .list('', {
        search: sku
      });
      
    if (error) {
      console.error(`Error searching for images for SKU ${sku}:`, error);
      return null;
    }
    
    if (matchingFiles && matchingFiles.length > 0) {
      const exactMatch = matchingFiles.find(file => 
        file.name === sku || 
        file.name === `${sku}.jpg` || 
        file.name === `${sku}.png` || 
        file.name === `${sku}.jpeg` || 
        file.name === `${sku}.webp`
      );
      
      if (exactMatch) {
        return getSupabaseImageUrl(exactMatch.name);
      }
      
      // If no exact match, return the first match
      return getSupabaseImageUrl(matchingFiles[0].name);
    }
    
    return null;
  } catch (e) {
    console.error(`Error finding image for SKU ${sku}:`, e);
    return null;
  }
};

/**
 * Check all potential image URLs for a SKU in parallel
 */
export const checkPotentialImageUrls = async (urls: string[]): Promise<string | null> => {
  if (!urls || urls.length === 0) return null;
  
  try {
    // Check all URLs in parallel
    const results = await Promise.allSettled(
      urls.map(url => 
        fetch(url, { method: 'HEAD' })
          .then(response => response.ok ? url : null)
          .catch(() => null)
      )
    );
    
    // Filter for valid URLs
    const validUrls = results
      .filter((result): result is PromiseFulfilledResult<string> => 
        result.status === 'fulfilled' && !!result.value
      )
      .map(result => result.value);
    
    if (validUrls.length > 0) {
      return validUrls[0];
    }
    
    return null;
  } catch (e) {
    console.error('Error checking potential image URLs:', e);
    return null;
  }
};
