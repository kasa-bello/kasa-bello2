
/**
 * Utility functions for parsing and extracting image URLs from product data
 */

import { Product } from '@/types/product.types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Safely parses a JSON string that might contain image URLs
 */
export const parseImageJson = (json: string | null): string[] => {
  if (!json) return [];
  
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      // Filter to ensure we only have valid string URLs
      return parsed.filter((url): url is string => typeof url === 'string' && url.trim() !== '');
    }
  } catch (e) {
    console.error("Error parsing image JSON:", e);
  }
  
  return [];
};

/**
 * Generate a Supabase storage URL for a product by SKU
 */
export const generateSupabaseImageUrl = (sku: string): string | null => {
  if (!sku || sku === 'unknown-sku') return null;
  
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(sku);
    
  return publicUrl;
};

/**
 * Extract image URLs from a product object
 */
export const extractImageUrls = (product: Product): string[] => {
  const urls: string[] = [];
  
  try {
    // First check for direct image URLs
    if (product["Image URL"] && typeof product["Image URL"] === 'string' && product["Image URL"].trim() !== '') {
      console.log(`Found Image URL for product ${product.Sku || 'unknown'}:`, product["Image URL"]);
      urls.push(product["Image URL"]);
    }
    
    // Try to generate a storage URL directly from the SKU
    if (product.Sku) {
      // Try with different potential extensions
      const skuUrl = generateSupabaseImageUrl(product.Sku);
      if (skuUrl) {
        console.log(`Generated storage URL for product ${product.Sku}:`, skuUrl);
        urls.push(skuUrl);
      }
      
      // Try with common image extensions
      const imageExtensions = ['.jpg', '.png', '.jpeg', '.webp'];
      
      for (const ext of imageExtensions) {
        const skuWithExtUrl = generateSupabaseImageUrl(`${product.Sku}${ext}`);
        if (skuWithExtUrl) {
          console.log(`Generated storage URL with extension for product ${product.Sku}:`, skuWithExtUrl);
          urls.push(skuWithExtUrl);
        }
      }
    }
    
    // Then check for Images field (could be string JSON or already an array)
    if (product.Images) {
      if (typeof product.Images === 'string') {
        try {
          const parsedUrls = parseImageJson(product.Images);
          if (parsedUrls.length > 0) {
            console.log(`Parsed Images JSON for product ${product.Sku || 'unknown'}:`, parsedUrls.slice(0, 3));
            urls.push(...parsedUrls);
          }
        } catch (e) {
          console.error(`Error parsing Images JSON for product ${product.Sku || 'unknown'}:`, e);
        }
      } else if (Array.isArray(product.Images)) {
        // Use a type guard to ensure array methods are available
        const imagesArray = product.Images as unknown as any[];
        const stringUrls = imagesArray.filter((item): item is string => 
          typeof item === 'string' && item.trim() !== '');
        if (stringUrls.length > 0) {
          console.log(`Found Images array for product ${product.Sku || 'unknown'}:`, stringUrls.slice(0, 3));
          urls.push(...stringUrls);
        }
      }
    }
    
    // Check for lowercase images field
    if (product.images) {
      if (typeof product.images === 'string') {
        try {
          const parsedUrls = parseImageJson(product.images);
          if (parsedUrls.length > 0) {
            console.log(`Parsed images JSON for product ${product.Sku || 'unknown'}:`, parsedUrls.slice(0, 3));
            urls.push(...parsedUrls);
          }
        } catch (e) {
          console.error(`Error parsing images JSON for product ${product.Sku || 'unknown'}:`, e);
        }
      } else if (Array.isArray(product.images)) {
        // Use a type guard to ensure array methods are available
        const imagesArray = product.images as unknown as any[];
        const stringUrls = imagesArray.filter((item): item is string => 
          typeof item === 'string' && item.trim() !== '');
        if (stringUrls.length > 0) {
          console.log(`Found images array for product ${product.Sku || 'unknown'}:`, stringUrls.slice(0, 3));
          urls.push(...stringUrls);
        }
      }
    }
    
    // Check for an aliased image field (some imports might use different naming)
    const possibleImageFields = ["imageURL", "image_url", "img", "image", "thumbnail"];
    for (const field of possibleImageFields) {
      if (product[field] && typeof product[field] === 'string' && product[field].trim() !== '') {
        console.log(`Found alternative image field '${field}' for product ${product.Sku || 'unknown'}:`, product[field]);
        urls.push(product[field] as string);
      }
    }
    
    // Check all product properties for potential image URLs
    if (urls.length === 0) {
      for (const [key, value] of Object.entries(product)) {
        if (typeof value === 'string' && 
            (value.includes('.jpg') || value.includes('.png') || value.includes('.jpeg') || value.includes('.webp')) &&
            (value.startsWith('http') || value.startsWith('/'))) {
          console.log(`Found potential image URL in field '${key}' for product ${product.Sku || 'unknown'}:`, value);
          urls.push(value);
        }
      }
    }
  } catch (error) {
    console.error(`Error extracting URLs for product ${product.Sku || 'unknown'}:`, error);
  }
  
  // Filter out any empty strings and normalize URLs
  const filteredUrls = urls
    .filter(url => url && url.trim() !== '')
    .map(url => {
      // If it's a relative URL that doesn't start with /, add the /
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
        return `/${url}`;
      }
      return url;
    });
  
  // Log the results for debugging
  if (filteredUrls.length > 0) {
    console.log(`Extracted ${filteredUrls.length} images for product ${product.Sku || 'unknown'}`);
  } else {
    console.log(`No images found for product ${product.Sku || 'unknown'}`);
  }
  
  return filteredUrls;
};
