
import React, { memo, useMemo, useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductDisplay } from "@/types/product.types";
import { ProductsDebugInfo } from "./ProductsDebugInfo";
import { ProductsDebugToggle } from "./ProductsDebugToggle";
import { ProductsCount } from "./ProductsCount";

interface ProductsGridProps {
  products: ProductDisplay[];
}

// Create memoized product card component to prevent unnecessary re-renders
const MemoizedProductCard = memo(ProductCard);

export const ProductsGrid: React.FC<ProductsGridProps> = memo(({ products }) => {
  const [showDebug, setShowDebug] = useState(false);
  
  // Make sure we have a valid products array
  const validProducts = useMemo(() => {
    // Ensure products is an array
    if (!Array.isArray(products)) {
      console.error("ProductsGrid: products is not an array", products);
      return [];
    }
    
    // Validation - only include products with valid data
    return products.filter(product => {
      if (!product) return false;
      
      // Skip known problematic SKUs
      const problematicSkus = ['IN3966', 'IN3806', 'IN3920', 'IN3833', 'IN3984'];
      if (problematicSkus.includes(product.id)) return false;
      
      return true;
    });
  }, [products]);

  // Hide debug components in production environment
  const isDevMode = process.env.NODE_ENV === 'development';

  return (
    <>
      <div className="flex justify-between items-center">
        <ProductsCount count={validProducts.length} />
        {isDevMode && !showDebug && (
          <ProductsDebugToggle onClick={() => setShowDebug(true)} />
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {validProducts.map((product) => (
          <MemoizedProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>
      
      {/* Debug information */}
      {isDevMode && showDebug && (
        <ProductsDebugInfo 
          products={validProducts} 
          onClose={() => setShowDebug(false)} 
        />
      )}
    </>
  );
});

// Add display name for better debugging
ProductsGrid.displayName = "ProductsGrid";
