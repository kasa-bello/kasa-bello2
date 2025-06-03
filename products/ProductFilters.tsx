
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import { ProductFilters as FiltersType } from "@/types/product.types";

interface ProductFiltersProps {
  filters: FiltersType;
  searchInput: string;
  onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPriceChange: (value: number[]) => void;
  onClearFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  searchInput,
  onSearchInputChange,
  onSearch,
  onKeyDown,
  onPriceChange,
  onClearFilters,
}) => {
  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        
        {/* Search */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Search</label>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search products..."
              value={searchInput}
              onChange={onSearchInputChange}
              onKeyDown={onKeyDown}
              className="flex-1"
            />
            <Button size="icon" onClick={onSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Price Range */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Price Range</label>
          <Slider
            defaultValue={[filters.minPrice || 0, filters.maxPrice || 2000]}
            max={2000}
            step={10}
            onValueChange={onPriceChange}
            className="my-6"
          />
          <div className="flex justify-between text-sm">
            <span>${filters.minPrice}</span>
            <span>${filters.maxPrice}</span>
          </div>
        </div>
        
        {/* Clear Filters */}
        <Button 
          variant="outline" 
          className="w-full mt-2"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
