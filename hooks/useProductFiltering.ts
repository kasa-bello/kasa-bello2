
import { useState, useMemo, useEffect, useCallback } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductFilters, ProductDisplay } from "@/types/product.types";
import { products as mockProducts } from "@/lib/data";
import { toast } from "sonner";

export const useProductFiltering = () => {
  // Filter state with debounce implementation
  const [filters, setFilters] = useState<ProductFilters>({
    minPrice: 0,
    maxPrice: 2000,
    search: "",
  });
  
  // State for the search input
  const [searchInput, setSearchInput] = useState("");
  
  // Get products from Supabase with the optimized hook
  const { data: supabaseProducts, isLoading: isSupabaseLoading, error } = useProducts(filters);
  
  // Custom loading state that we can control
  const [isLoading, setIsLoading] = useState(true);
  
  // Track if we've shown the success toast to avoid showing it on every re-render
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
  
  // Update loading state based on Supabase response
  useEffect(() => {
    // If we have an error, we're no longer loading
    if (error) {
      setIsLoading(false);
      
      // Show error toast only once
      toast.error("Error loading products", {
        description: "There was an error loading products from the database. Showing local products only."
      });
      console.error("Error loading products:", error);
    } 
    // If we've received data from Supabase (even if it's empty), we're no longer loading
    else if (supabaseProducts !== undefined) {
      setIsLoading(false);
      
      // Only show success toast for actual products loaded
      if (supabaseProducts && 
          Array.isArray(supabaseProducts) && 
          supabaseProducts.length > 0 &&
          !hasShownSuccessToast && 
          isSupabaseLoading === false) {
        
        toast.success("Products loaded", {
          description: `Loaded ${supabaseProducts.length} products from the database.`
        });
        
        setHasShownSuccessToast(true);
      }
    }
  }, [supabaseProducts, error, isSupabaseLoading, hasShownSuccessToast]);
  
  // Filter mock products based on the same criteria - optimized with useMemo
  const filteredMockProducts = useMemo(() => {
    if (!filters.search && filters.minPrice === 0 && filters.maxPrice === 2000) {
      // If no filters, return all mock products without filtering
      return mockProducts;
    }
    
    // Only filter when necessary
    return mockProducts.filter(product => {
      const matchesSearch = 
        !filters.search || 
        product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesPrice = 
        (!filters.minPrice || product.price >= filters.minPrice) &&
        (!filters.maxPrice || product.price <= filters.maxPrice);
      
      return matchesSearch && matchesPrice;
    });
  }, [filters]);
  
  // Convert mock products to match ProductDisplay interface - memoized
  const mockProductsFormatted = useMemo(() => {
    return filteredMockProducts.map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.images[0],
      category: product.category,
      description: product.description,
      parsedImages: product.images
    }));
  }, [filteredMockProducts]);
  
  // Combine both sources of products - memoized to prevent unnecessary re-renders
  const allProducts = useMemo(() => {
    // Ensure supabaseProducts is an array before processing
    const supabaseProductsList = Array.isArray(supabaseProducts) ? supabaseProducts : [];
    
    try {
      // Safely combine products
      return [...supabaseProductsList, ...mockProductsFormatted];
    } catch (err) {
      console.error("Error combining products:", err);
      // Fall back to just mock products if there's an error combining
      return mockProductsFormatted;
    }
  }, [supabaseProducts, mockProductsFormatted]);
  
  // Handle price range change with useCallback
  const handlePriceChange = useCallback((value: number[]) => {
    setFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1]
    }));
  }, []);
  
  // Handle search submission with useCallback
  const handleSearch = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      search: searchInput
    }));
  }, [searchInput]);
  
  // Handle search input change with useCallback
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);
  
  // Handle search on Enter key with useCallback
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);
  
  // Handle clear filters with useCallback
  const handleClearFilters = useCallback(() => {
    setFilters({
      minPrice: 0,
      maxPrice: 2000,
      search: ""
    });
    setSearchInput("");
  }, []);

  return {
    filters,
    searchInput,
    isLoading,
    error,
    allProducts: allProducts || [], // Ensure we always return an array
    handlePriceChange,
    handleSearch,
    handleSearchInputChange,
    handleKeyDown,
    handleClearFilters
  };
};
