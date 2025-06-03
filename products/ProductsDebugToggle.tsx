
import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ProductsDebugToggleProps {
  onClick: () => void;
}

export const ProductsDebugToggle: React.FC<ProductsDebugToggleProps> = memo(({ onClick }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="mb-4"
    >
      Show Debug Info
      <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
  );
});

ProductsDebugToggle.displayName = "ProductsDebugToggle";
