
/**
 * Utilities for handling CSV and Excel headers
 */

// Function to normalize headers (case-insensitive and handle common variations)
export const normalizeHeader = (header: string): string => {
  // Convert to lowercase and trim whitespace
  const normalized = header.toLowerCase().trim();
  
  // Map variations to standard names
  const headerMap: Record<string, string> = {
    // Standard headers
    'title': 'title',
    'description': 'description',
    'price': 'price',
    'category': 'category',
    // Common variations
    'product title': 'title',
    'product name': 'title',
    'name': 'title',
    'product description': 'description',
    'desc': 'description',
    'short description': 'description',
    'product price': 'price',
    'selling price': 'price',
    'sale price': 'price',
    'cost': 'price',
    'product category': 'category',
    'cat': 'category',
    'type': 'category',
    // Add the specific headers from the user's file
    'sku': 'sku',
    'carton depth': 'cartonDepth',
    'carton height': 'cartonHeight',
    'carton width': 'cartonWidth',
    'assembly instructions': 'assemblyInstructions',
    'depth': 'depth',
    'height': 'height',
    'width': 'width',
    'shipping weight': 'shippingWeight',
    'boxed weight': 'boxedWeight',
    'product-weight': 'productWeight',
    'ean': 'ean'
  };
  
  return headerMap[normalized] || normalized;
};

// Modified to set a default category if missing
export const validateRequiredHeaders = (
  normalizedHeaders: string[], 
  requiredHeaders: string[] = ['title', 'description', 'price']
): string[] => {
  return requiredHeaders.filter(h => !normalizedHeaders.includes(h));
};
