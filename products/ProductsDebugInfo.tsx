
import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { ProductDisplay } from "@/types/product.types";

interface ProductsDebugInfoProps {
  products: ProductDisplay[];
  onClose: () => void;
}

export const ProductsDebugInfo: React.FC<ProductsDebugInfoProps> = memo(({ products, onClose }) => {
  return (
    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm overflow-auto max-h-96">
      <div className="flex justify-between items-center mb-2">
        <p className="font-medium">Products Debug Info:</p>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2" 
          onClick={onClose}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
      <p>Total products: {products.length}</p>
      <p>Product IDs: {products.slice(0, 5).map(p => p.id).join(', ')}{products.length > 5 ? '...' : ''}</p>
      
      <div className="mt-2">
        <p className="font-medium">Sample Product Data:</p>
        <ul className="text-xs">
          {products.slice(0, 3).map(p => (
            <li key={p.id} className="mt-1 mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
              <p><strong>ID:</strong> {p.id}</p>
              <p><strong>Title:</strong> {p.title}</p>
              <p><strong>imageUrl:</strong> {p.imageUrl?.substring(0, 40)}{p.imageUrl?.length > 40 ? '...' : ''}</p>
              <p><strong>parsedImages:</strong> {p.parsedImages ? `${p.parsedImages.length} images` : 'none'}</p>
              <p><strong>images type:</strong> {p.images ? (typeof p.images === 'string' ? 'string' : (Array.isArray(p.images) ? 'array' : typeof p.images)) : 'undefined'}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

ProductsDebugInfo.displayName = "ProductsDebugInfo";
