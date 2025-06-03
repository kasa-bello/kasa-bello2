
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductFilters, ProductDisplay } from "@/types/product.types";
import { toast } from "sonner";
import { mapProductToDisplay } from "@/utils/productImageUtils";

/**
 * Hook to fetch all products with optional filtering
 */
export const useProductsList = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      try {
        // Start with a basic query
        let query = supabase.from("Products").select("*");

        // Only apply filters if they're provided and not empty values
        if (filters) {
          if (filters.category && filters.category !== 'all') {
            query = query.ilike("category", `%${filters.category}%`);
          }
          if (filters.minPrice !== undefined && filters.minPrice > 0) {
            query = query.gte("Selling price", filters.minPrice);
          }
          if (filters.maxPrice !== undefined && filters.maxPrice < 2000) {
            query = query.lte("Selling price", filters.maxPrice);
          }
          if (filters.search && filters.search.trim() !== '') {
            query = query.or(`Title.ilike.%${filters.search}%,Description.ilike.%${filters.search}%`);
          }
        }

        console.log("Fetching products from Supabase...");
        const { data, error } = await query;

        if (error) {
          console.error("Supabase query error:", error);
          toast.error("Failed to load products", {
            description: error.message
          });
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.log("No products found in Supabase");
          return [];
        }
        
        console.log(`Found ${data.length} products in Supabase`);
        
        // Map the raw products to ProductDisplay objects
        const mappedProducts = data.map(mapProductToDisplay);
        console.log(`Successfully mapped ${mappedProducts.length} products`);
        
        // Now perform more rigorous validation to filter out products with potentially bad images
        const validatedProducts = await Promise.all(
          mappedProducts.map(async (product) => {
            // Check if product has parsedImages and at least one exists
            if (!product.parsedImages || product.parsedImages.length === 0) {
              return null; // No images, filter out
            }

            // Check if product has a valid SKU
            if (!product.id || product.id === 'unknown-sku') {
              return null; // No valid SKU, filter out
            }

            // Validate the first image is loadable
            try {
              // Only test the first image to avoid too many requests
              const imageUrl = product.parsedImages[0];
              
              // Skip validation for placeholder images
              if (imageUrl === '/placeholder.svg') {
                return null; // Placeholder image, filter out
              }
              
              // Check if SKUs that are known to fail
              const problematicSkus = ['IN3966', 'IN3806', 'IN3920', 'IN3833', 'IN3984'];
              if (problematicSkus.includes(product.id)) {
                console.log(`Filtering out product with known problematic SKU: ${product.id}`);
                return null;
              }
              
              return product;
            } catch (error) {
              console.error(`Error validating image for product ${product.id}:`, error);
              return null;
            }
          })
        );
        
        // Filter out null products (those that failed validation)
        const productsWithImages = validatedProducts.filter((p): p is ProductDisplay => p !== null);
        
        console.log(`Filtered to ${productsWithImages.length} products with valid images out of ${mappedProducts.length} total products`);
        
        if (productsWithImages.length === 0) {
          toast.warning("No products with valid images found", {
            description: "Try adjusting your filters or check product data"
          });
        }
        
        return productsWithImages;
      } catch (error) {
        console.error("Error in useProducts query:", error);
        toast.error("Error loading products", {
          description: error instanceof Error ? error.message : "Unknown error"
        });
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
