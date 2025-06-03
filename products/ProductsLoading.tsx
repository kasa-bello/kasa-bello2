
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const ProductsLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <Button disabled className="bg-primary/80">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading products
      </Button>
    </div>
  );
};
