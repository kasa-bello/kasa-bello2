
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../data';
import { normalizeHeader } from './headerUtils';

// Common function to convert rows to product objects
export const convertRowsToProducts = (rows: any[][]): Product[] => {
  const products: Product[] = [];
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 3) continue; // Skip empty or invalid rows
    
    const row = rows[i];
    const product: any = {
      id: uuidv4(), // Generate a unique ID
      category: 'furniture', // Default category if none is provided
    };
    
    // Map columns to product properties based on normalized headers
    rows[0].forEach((originalHeader, index) => {
      if (index < row.length) {
        const normalizedHeader = normalizeHeader(String(originalHeader));
        let value = row[index];
        
        // Handle different types of values from Excel
        if (typeof value === 'string') {
          value = value.replace(/^"|"$/g, ''); // Remove quotes
        }
        
        switch (normalizedHeader) {
          case 'price':
          case 'originalprice':
            // Convert price value and handle various formats
            // Remove currency symbols and convert commas to dots if needed
            if (typeof value === 'string') {
              value = value.replace(/[£$€]/g, '').replace(/,/g, '.');
            }
            product[normalizedHeader] = parseFloat(value) || 0;
            break;
          case 'rating':
            product[normalizedHeader] = parseFloat(value) || 4.0;
            break;
          case 'reviewcount':
          case 'stock':
            product[normalizedHeader] = parseInt(value) || 0;
            break;
          case 'bestseller':
          case 'new':
          case 'featured':
            product[normalizedHeader] = String(value).toLowerCase() === 'true';
            break;
          case 'images':
            // Store original image URLs (will be processed later)
            if (typeof value === 'string') {
              product[normalizedHeader] = value.split(',').map((url: string) => url.trim());
            } else {
              product[normalizedHeader] = [String(value)].filter(Boolean);
            }
            break;
          case 'features':
            if (typeof value === 'string') {
              product[normalizedHeader] = value.split(',').map((feature: string) => feature.trim());
            } else {
              product[normalizedHeader] = [String(value)].filter(Boolean);
            }
            break;
          default:
            product[normalizedHeader] = value;
        }
      }
    });
    
    // Set default values for missing fields
    product.images = product.images || ["https://placehold.co/600x400?text=No+Image"];
    product.features = product.features || [];
    product.rating = product.rating || 4.0;
    product.reviewCount = product.reviewCount || 0;
    product.stock = product.stock || 10;
    
    // Handle the case where title isn't directly mapped but might be in another field
    if (!product.title && product.sku) {
      product.title = `Product ${product.sku}`;
    }
    
    // Add to products array if it has the minimum required fields
    if (product.title && product.description && product.price) {
      products.push(product as Product);
    } else {
      console.warn(`Row ${i} is missing required fields:`, product);
    }
  }
  
  return products;
};
