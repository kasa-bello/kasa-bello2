
import { useProductsList } from "./useProductsList";
import { useProductDetail } from "./useProductDetail";

// Re-export the hooks to maintain backward compatibility
export const useProducts = useProductsList;
export const useProduct = useProductDetail;
