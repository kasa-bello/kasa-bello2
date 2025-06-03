
/**
 * Utilities for extracting image information from product data
 */
import { Product } from '@/types/product.types';
import { processStorageUrl } from './urlProcessor';
import { generatePotentialImageUrls } from './urlProcessor';
import { parseImageField } from './jsonParser';
import { supabase } from '@/integrations/supabase/client';

/**
 * Extract direct image URL from product fields
 */
export const extractDirectImageUrls = (product: Product): string[] => {
  const urls: string[] = [];
  
  // Check for Image URL (uppercase field)
  if (product["Image URL"] && typeof product["Image URL"] === 'string') {
    const processedUrl = processStorageUrl(product["Image URL"]);
    if (processedUrl !== '/placeholder.svg') {
      urls.push(processedUrl);
      console.log(`Using Image URL for product ${product.Sku || 'unknown'}:`, processedUrl);
    }
  }
  
  // Check for other potential image fields
  const directImageFields = ["imageURL", "image_url", "img", "image"];
  for (const field of directImageFields) {
    if (product[field] && typeof product[field] === 'string' && urls.length === 0) {
      const processedUrl = processStorageUrl(product[field] as string);
      if (processedUrl !== '/placeholder.svg') {
        urls.push(processedUrl);
        console.log(`Found image in field ${field} for product ${product.Sku || 'unknown'}:`, processedUrl);
      }
    }
  }
  
  // Check for thumbnail field
  if (product["thumbnail"] && typeof product["thumbnail"] === 'string' && urls.length === 0) {
    const processedUrl = processStorageUrl(product["thumbnail"]);
    if (processedUrl !== '/placeholder.svg') {
      urls.push(processedUrl);
      console.log(`Using thumbnail for product ${product.Sku || 'unknown'}:`, processedUrl);
    }
  }
  
  return urls;
};

/**
 * Extract and process images from a product
 */
export const extractProductImages = (product: Product): { imageUrl: string, parsedImages: string[] } => {
  let parsedImages: string[] = [];
  let imageUrl = '/placeholder.svg';
  
  try {
    // 1. First get any direct image URLs
    const directUrls = extractDirectImageUrls(product);
    if (directUrls.length > 0) {
      imageUrl = directUrls[0];
      parsedImages.push(...directUrls);
    }
    
    // 2. Try to parse and use the Images field (uppercase)
    if (product.Images) {
      const imagesFromUppercase = parseImageField(product, 'Images', processStorageUrl);
      if (imagesFromUppercase.length > 0) {
        if (imageUrl === '/placeholder.svg') {
          imageUrl = imagesFromUppercase[0];
        }
        parsedImages = [...new Set([...parsedImages, ...imagesFromUppercase])];
      }
    } 
    
    // 3. Then try the lowercase 'images' field
    if (product.images) {
      const imagesFromLowercase = parseImageField(product, 'images', processStorageUrl);
      if (imagesFromLowercase.length > 0) {
        if (imageUrl === '/placeholder.svg') {
          imageUrl = imagesFromLowercase[0];
        }
        parsedImages = [...new Set([...parsedImages, ...imagesFromLowercase])];
      }
    }
    
    // 4. If still no images, try to create a URL based on the SKU
    if (parsedImages.length === 0 && product.Sku) {
      // Try potential formats
      const potentialUrls = generatePotentialImageUrls(product.Sku);
      
      if (potentialUrls.length > 0) {
        imageUrl = potentialUrls[0];
        parsedImages = potentialUrls;
        console.log(`Generated potential image URLs for product ${product.Sku}`, potentialUrls);
      }
    }
    
    // 5. Final check if we didn't find any images, try to look for any fields that might contain image URLs
    if (parsedImages.length === 0) {
      for (const [key, value] of Object.entries(product)) {
        if (typeof value === 'string' && 
            (value.includes('.jpg') || value.includes('.png') || value.includes('.jpeg') || value.includes('.webp')) &&
            (value.startsWith('http') || value.startsWith('/')) &&
            !key.toLowerCase().includes('url')) {
          const processedUrl = processStorageUrl(value);
          if (processedUrl !== '/placeholder.svg') {
            imageUrl = processedUrl;
            parsedImages.push(processedUrl);
            console.log(`Found potential image URL in field ${key} for product ${product.Sku || 'unknown'}:`, processedUrl);
            break;
          }
        }
      }
    }
    
    // Log status
    if (parsedImages.length === 0 && imageUrl === '/placeholder.svg') {
      console.log(`No images found for product ${product.Sku || 'unknown'}, using placeholder`);
    }
  } catch (e) {
    console.error(`Error extracting images for product ${product.Sku || 'unknown'}:`, e);
  }
  
  return { imageUrl, parsedImages };
};
