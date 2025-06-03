
/**
 * Utility for mapping product data to display objects
 */
import { Product, ProductDisplay } from '@/types/product.types';
import { extractProductImages } from './extractors';

/**
 * Map a Supabase Product to a ProductDisplay object
 * @param product Product from Supabase
 * @returns Mapped ProductDisplay object
 */
export const mapProductToDisplay = (product: Product): ProductDisplay => {
  // Extract and process images
  const { imageUrl, parsedImages } = extractProductImages(product);
  
  // Create a ProductDisplay object with proper fallbacks for all fields
  return {
    id: product.Sku || 'unknown-sku',
    title: product.Title || 'Untitled Product',
    price: product["Selling price"] ?? 0,
    imageUrl: imageUrl,
    category: product.category || '',
    description: product.Description || product["Short Description"] || '',
    images: product.images || product.Images,
    parsedImages: parsedImages.length > 0 ? parsedImages : [],
  };
};
