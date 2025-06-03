
import React, { useEffect, useState } from 'react';
import { Hero } from '@/components/ui/Hero';
import { FeaturedProducts } from '@/components/ui/FeaturedProducts';
import { Footer } from '@/components/ui/Footer';
import { Navbar } from '@/components/ui/Navbar';
import { 
  categories
} from '@/lib/data';
import { Link } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { useProductsList } from '@/hooks/useProductsList';
import { ProductDisplay } from '@/types/product.types';

// Categories to display on the homepage in this order (if products exist)
const FEATURED_CATEGORIES = [
  'bedroom',
  'sofas',
  'dining',
  'tables',
  'chairs',
  'storage',
  'decor'
];

// Mapping of category IDs to display names
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'bedroom': 'Bedroom Furniture',
  'sofas': 'Sofas & Sectionals',
  'dining': 'Dining Room',
  'tables': 'Tables',
  'chairs': 'Chairs & Seating',
  'storage': 'Storage & Organization',
  'decor': 'Home Decor',
  'desks': 'Office Furniture',
  'lighting': 'Lighting',
  'rugs': 'Rugs & Carpets',
  'furniture': 'All Furniture'
};

const Index = () => {
  const { data: supabaseProducts, isLoading } = useProductsList();
  const [categorizedProducts, setCategorizedProducts] = useState<Record<string, ProductDisplay[]>>({});
  
  // Organize products by category once data is loaded
  useEffect(() => {
    if (supabaseProducts && supabaseProducts.length > 0) {
      const productsByCategory: Record<string, ProductDisplay[]> = {};
      
      // Group products by category
      supabaseProducts.forEach(product => {
        if (product.category) {
          const category = product.category.toLowerCase();
          if (!productsByCategory[category]) {
            productsByCategory[category] = [];
          }
          productsByCategory[category].push(product);
        }
      });
      
      setCategorizedProducts(productsByCategory);
      console.log("Products organized by category:", Object.keys(productsByCategory));
    }
  }, [supabaseProducts]);
  
  // Get a list of all available categories from the products
  const availableCategories = Object.keys(categorizedProducts);

  // Order categories according to our priority list
  const orderedCategories = FEATURED_CATEGORIES.filter(cat => 
    availableCategories.includes(cat) && categorizedProducts[cat].length > 0
  );
  
  // Add any remaining categories not in our priority list
  availableCategories.forEach(cat => {
    if (!orderedCategories.includes(cat) && categorizedProducts[cat].length > 0) {
      orderedCategories.push(cat);
    }
  });

  return (
    <CartProvider>
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-16">
          <Hero />
          
          {/* Categories Section */}
          <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Shop by Category</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Explore our curated selection of premium furniture and home essentials
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="group relative overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-lg">{category.name}</h3>
                        <p className="text-sm text-white/80 mt-1 line-clamp-2">{category.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="py-8 text-center">
              <p className="text-gray-500">Loading products...</p>
            </div>
          )}
          
          {/* Dynamically render product sections by category */}
          {!isLoading && orderedCategories.length > 0 && (
            <>
              {orderedCategories.map(categoryId => (
                <FeaturedProducts
                  key={categoryId}
                  title={CATEGORY_DISPLAY_NAMES[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
                  products={categorizedProducts[categoryId] || []}
                  link={`/category/${categoryId}`}
                  linkText={`View All ${CATEGORY_DISPLAY_NAMES[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}`}
                  category={categoryId}
                />
              ))}
            </>
          )}
          
          {/* Empty state when no categorized products are found */}
          {!isLoading && orderedCategories.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No categorized products found. Please update product categories first.</p>
            </div>
          )}
          
          {/* Banner Section */}
          <section className="py-12 md:py-16">
            <div className="container px-4 md:px-6">
              <div className="relative overflow-hidden rounded-xl">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1616137466211-f939a420be84?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.0.3" 
                    alt="Interior design banner" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/10"></div>
                </div>
                
                <div className="relative py-12 md:py-20 px-6 md:px-12 lg:max-w-lg">
                  <span className="inline-block bg-white text-primary text-sm font-medium px-3 py-1 rounded-full mb-4">
                    Limited Time Offer
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
                    Transform Your Space With Summer Savings
                  </h2>
                  <p className="text-white/80 mb-6 max-w-md">
                    Enjoy up to 30% off on select furniture and home decor. Create the perfect living environment with our premium quality products.
                  </p>
                  <Link
                    to="/products?sale=true"
                    className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-primary rounded-lg shadow hover:bg-primary/90 transition-colors"
                  >
                    Shop the Sale
                  </Link>
                </div>
              </div>
            </div>
          </section>
          
          {/* Newsletter Section */}
          <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                  Subscribe to Our Newsletter
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Stay updated with our latest products, exclusive offers, and interior design inspiration.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Subscribe
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                </p>
              </div>
            </div>
          </section>
          
          <Footer />
        </div>
      </div>
    </CartProvider>
  );
};

export default Index;
