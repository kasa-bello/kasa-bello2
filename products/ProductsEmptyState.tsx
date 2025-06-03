
import React from "react";
import { Link } from "react-router-dom";
import { FileUp, Import, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProductsEmptyState: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="bg-white dark:bg-gray-700 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
        <Import className="h-8 w-8 text-primary" />
      </div>
      
      <h3 className="text-xl font-medium mb-3">No products in your store yet</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Get started by importing products from CSV/Excel files, or adjust your current filters if you believe products should be showing.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/admin/import">
          <Button className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Import Products
          </Button>
        </Link>
        
        <Link to="/admin/import">
          <Button variant="outline" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Learn How to Import
          </Button>
        </Link>
      </div>
      
      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-300 text-sm max-w-lg mx-auto">
        <p className="font-medium">Having trouble seeing your products?</p>
        <p className="mt-1">If you've already imported products and they're not showing, try checking your database connection or refreshing the page.</p>
      </div>
    </div>
  );
};
