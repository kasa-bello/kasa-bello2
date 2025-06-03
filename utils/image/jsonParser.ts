
/**
 * Utilities for parsing JSON image data
 */
import { Product } from '@/types/product.types';

/**
 * Parse JSON safely and return an array
 * @param jsonString JSON string to parse
 * @returns Parsed array or empty array if parsing fails
 */
export const safeJsonParse = (jsonString: string | null | undefined): any[] => {
  if (!jsonString) return [];
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [parsed].filter(Boolean);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return [];
  }
};

/**
 * Try to parse and use a specific field (Images or images) as JSON
 */
export const parseImageField = (
  product: Product, 
  fieldName: string, 
  processUrl: (url: string) => string
): string[] => {
  const parsedImages: string[] = [];
  
  try {
    const field = product[fieldName];
    if (typeof field === 'string') {
      const imageArray = safeJsonParse(field);
      const processedUrls = imageArray
        .filter((url): url is string => typeof url === 'string' && url.trim() !== '')
        .map(url => processUrl(url))
        .filter(url => url !== '/placeholder.svg');
        
      if (processedUrls.length > 0) {
        parsedImages.push(...processedUrls);
        console.log(`Parsed ${fieldName} JSON for product ${product.Sku || 'unknown'}:`, processedUrls.slice(0, 3));
      }
    } else if (Array.isArray(field)) {
      // Cast to any[] to ensure TypeScript sees it as an array with filter method
      const imagesArray = field as unknown as any[];
      const processedUrls = imagesArray
        .filter((url): url is string => typeof url === 'string' && url.trim() !== '')
        .map(url => processUrl(url))
        .filter(url => url !== '/placeholder.svg');
      
      if (processedUrls.length > 0) {
        parsedImages.push(...processedUrls);
        console.log(`Processed ${fieldName} array for product ${product.Sku || 'unknown'}:`, processedUrls.slice(0, 3));
      }
    }
  } catch (e) {
    console.error(`Failed to process ${fieldName} for product ${product.Sku || 'unknown'}:`, e);
  }
  
  return parsedImages;
};
