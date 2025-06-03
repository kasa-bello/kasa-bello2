
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { FeaturedProducts } from "@/components/ui/FeaturedProducts";
import { categories, getProductsByCategory } from "@/lib/data";
import { ProductDisplay } from "@/types/product.types";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Category = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [mockProducts, setMockProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<{ name: string; description: string } | null>(null);
  
  // Fetch Supabase products filtered by category
  const { data: supabaseProducts, isLoading } = useProducts({ 
    category: categoryId 
  });
  
  useEffect(() => {
    if (categoryId) {
      // Find the category details
      const categoryDetails = categories.find(cat => cat.id === categoryId);
      setCategory(categoryDetails || null);
      
      // Get mock products for this category
      const categoryProducts = getProductsByCategory(categoryId);
      setMockProducts(categoryProducts);
      
      // Log for debugging
      console.log(`Loading category: ${categoryId}, found ${categoryProducts.length} mock products`);
    }
  }, [categoryId]);

  // Combine both product sources
  const allProducts = [
    ...(supabaseProducts || []),
    ...mockProducts
  ];

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-gray-500">Category not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Category Hero */}
        <div className="bg-gray-50 dark:bg-gray-900 py-12 md:py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">{category.description}</p>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="py-16 text-center">
            <Button disabled className="mx-auto">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading products
            </Button>
          </div>
        )}
        
        {/* Products */}
        {!isLoading && allProducts.length > 0 ? (
          <FeaturedProducts 
            title={`${category.name} Products`}
            products={allProducts}
            link="/products"
            linkText="View All Products"
          />
        ) : !isLoading && (
          <div className="py-16 text-center">
            <p className="text-gray-500 dark:text-gray-400">No products found in this category.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Category;
