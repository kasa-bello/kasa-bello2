
import { Tables } from "@/integrations/supabase/types";

// Define our own product type based on the Supabase Products table
export type Product = Tables<"Products"> & {
  // Add additional fields that might not be in the Supabase types
  category?: string | null;
  images?: string | string[] | null; // JSON string of image URLs or already parsed array
  "Image URL"?: string | null; // Add this field which exists in Supabase but might not be in the types
  "Short Description"?: string | null; // Add this field for completeness
  price?: number | null; // For backward compatibility
  Images?: string | string[] | null; // For the JSON string of multiple images or parsed array
};

// Helper type for product filtering
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Type for product display in UI
export interface ProductDisplay {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category?: string;
  description?: string;
  images?: string | string[] | null;
  parsedImages?: string[];
}

// Type for cart items
export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
