
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductDisplay } from "@/types/product.types";
import { toast } from "sonner";
import { mapProductToDisplay } from "@/utils/productImageUtils";

/**
 * Hook to fetch a single product by ID (SKU)
 */
export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      try {
        if (!id) {
          toast.error("Missing product ID");
          throw new Error("Missing product ID");
        }

        console.log(`Fetching product details for ID: ${id}`);
        const { data, error } = await supabase
          .from("Products")
          .select("*")
          .eq("Sku", id)
          .maybeSingle();

        if (error) {
          console.error("Supabase query error:", error);
          toast.error("Failed to load product details", {
            description: error.message,
          });
          throw error;
        }

        if (!data) {
          console.log(`No product found with ID: ${id}`);
          return null;
        }

        console.log(`Found product with ID ${id}:`, data);
        
        // Map the product to a ProductDisplay object 
        const mappedProduct = mapProductToDisplay(data);
        
        console.log(`Mapped product ${id}:`, mappedProduct);
        
        return mappedProduct;
      } catch (error) {
        console.error("Error in useProductDetail:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
