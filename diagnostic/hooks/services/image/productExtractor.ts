
/**
 * Service for extracting information from products
 */

import { Product } from '@/types/product.types';
import { extractImageUrls } from '../../utils/imageParsingUtils';

/**
 * Get products with direct image URLs
 */
export const getProductsWithDirectUrls = (products: Product[]): Product[] => {
  return products.filter(p => 
    p["Image URL"] && 
    typeof p["Image URL"] === 'string' && 
    p["Image URL"].trim() !== ''
  );
};

/**
 * Get products with Images field (JSON or array)
 */
export const getProductsWithImagesField = (products: Product[]): Product[] => {
  return products.filter(p => p.Images || p.images);
};

/**
 * Extract direct image URLs from products
 */
export const extractDirectImageUrls = (products: Product[]): string[] => {
  const urls: string[] = [];
  
  for (const product of products) {
    const imageUrl = product["Image URL"] as string;
    if (imageUrl && !urls.includes(imageUrl)) {
      urls.push(imageUrl);
    }
  }
  
  return urls;
};

/**
 * Extract all possible image URLs from products
 */
export const extractAllProductImageUrls = (products: Product[]): string[] => {
  const urls: string[] = [];
  
  for (const product of products) {
    const productUrls = extractImageUrls(product);
    for (const url of productUrls) {
      if (!urls.includes(url)) {
        urls.push(url);
      }
    }
  }
  
  return urls;
};
