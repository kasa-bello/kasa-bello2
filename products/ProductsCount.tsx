
import React, { memo } from "react";

interface ProductsCountProps {
  count: number;
}

export const ProductsCount: React.FC<ProductsCountProps> = memo(({ count }) => {
  return (
    <p className="mb-4 text-gray-600 dark:text-gray-300">
      Found {count} products
    </p>
  );
});

ProductsCount.displayName = "ProductsCount";
