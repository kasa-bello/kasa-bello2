
/**
 * Service for fetching product images
 * This file imports and exports functionality from the smaller, more focused service files
 */

import { findImagesBySku } from './image/findImagesBySku';
import { fetchProductImages } from './image/productImageFetcher';

// Export the main functions
export { 
  findImagesBySku,
  fetchProductImages
};
