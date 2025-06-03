
/**
 * Service for managing product categories
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Map products to categories based on their titles
 */
export const updateProductCategories = async (): Promise<void> => {
  try {
    // Fetch products without categories
    const { data: productsWithoutCategory, error } = await supabase
      .from('Products')
      .select('Sku, Title')
      .is('category', null);
    
    if (error) {
      console.error("Error fetching products without categories:", error);
      return;
    }

    if (!productsWithoutCategory || productsWithoutCategory.length === 0) {
      console.log("No products without categories found");
      return;
    }

    console.log(`Found ${productsWithoutCategory.length} products without categories`);

    // Category mapping function based on product title keywords
    for (const product of productsWithoutCategory) {
      const title = product.Title?.toLowerCase() || '';
      let category = '';
      
      if (title.includes('desk') || title.includes('office')) {
        category = 'desks';
      } else if (title.includes('bed') || title.includes('nightstand') || title.includes('mattress')) {
        category = 'bedroom';
      } else if (title.includes('sofa') || title.includes('couch') || title.includes('sectional') || title.includes('loveseat')) {
        category = 'sofas';
      } else if (title.includes('chair') || title.includes('stool') || title.includes('seating')) {
        category = 'chairs';
      } else if (title.includes('table') && (title.includes('dining') || title.includes('kitchen'))) {
        category = 'dining';
      } else if (title.includes('coffee table') || title.includes('side table') || title.includes('console')) {
        category = 'tables';
      } else if (title.includes('cabinet') || title.includes('storage') || title.includes('shelf') || title.includes('bookcase') || title.includes('trunk')) {
        category = 'storage';
      } else if (title.includes('lamp') || title.includes('lighting') || title.includes('chandelier')) {
        category = 'lighting';
      } else if (title.includes('rug') || title.includes('carpet')) {
        category = 'rugs';
      } else if (title.includes('decor') || title.includes('art') || title.includes('mirror') || title.includes('vase')) {
        category = 'decor';
      } else {
        // Default fallback category based on most likely furniture type
        if (title.includes('table')) {
          category = 'tables';
        } else if (title.includes('bench')) {
          category = 'seating';
        } else {
          category = 'furniture';
        }
      }

      if (category) {
        // Update product with the determined category
        const { error: updateError } = await supabase
          .from('Products')
          .update({ category })
          .eq('Sku', product.Sku);
        
        if (updateError) {
          console.error(`Error updating category for product ${product.Sku}:`, updateError);
        } else {
          console.log(`Updated product ${product.Sku} with category: ${category}`);
        }
      }
    }
  } catch (e) {
    console.error("Error updating product categories:", e);
  }
};
