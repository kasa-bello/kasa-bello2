
import React, { useEffect } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductsLoading } from "@/components/products/ProductsLoading";
import { ProductsEmptyState } from "@/components/products/ProductsEmptyState";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { useProductFiltering } from "@/hooks/useProductFiltering";

const AllProducts = () => {
  const {
    filters,
    searchInput,
    isLoading,
    error,
    allProducts,
    handlePriceChange,
    handleSearch,
    handleSearchInputChange,
    handleKeyDown,
    handleClearFilters
  } = useProductFiltering();
  
  useEffect(() => {
    // Log products data when it changes
    if (allProducts) {
      console.log(`Displaying ${allProducts.length} products`);
    }
    if (error) {
      console.error("Error loading products:", error);
    }
  }, [allProducts, error]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-purple/10 to-magenta/10 dark:from-purple/20 dark:to-magenta/20 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">All Products</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Browse our complete collection of high-quality products.
            </p>
          </div>
        </div>
        
        {/* Filters and Products */}
        <div className="container px-4 md:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <ProductFilters 
              filters={filters}
              searchInput={searchInput}
              onSearchInputChange={handleSearchInputChange}
              onSearch={handleSearch}
              onKeyDown={handleKeyDown}
              onPriceChange={handlePriceChange}
              onClearFilters={handleClearFilters}
            />
            
            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <ProductsLoading />
              ) : allProducts && allProducts.length > 0 ? (
                <ProductsGrid products={allProducts} />
              ) : (
                <ProductsEmptyState />
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AllProducts;
