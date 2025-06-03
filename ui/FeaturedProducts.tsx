import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';
import { ProductDisplay } from '@/types/product.types';

interface FeaturedProductsProps {
  title: string;
  products: ProductDisplay[] | any[]; // Accept both mock products and Supabase products
  link?: string;
  linkText?: string;
  layout?: 'grid' | 'carousel';
  category?: string;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  title, 
  products, 
  link = "/products",
  linkText = "View All Products",
  layout = 'grid',
  category
}) => {
  // Convert all products to ProductDisplay format and filter by category if provided
  const formattedProducts = products
    .map(product => {
      // Check if this is already a ProductDisplay object
      if ('parsedImages' in product || 'imageUrl' in product) {
        return product;
      }
      
      // Otherwise, convert it to ProductDisplay format
      return {
        id: product.id || product.Sku || 'unknown',
        title: product.title || product.Title || 'Untitled Product',
        price: product.price || product["Selling price"] || 0,
        imageUrl: product.imageUrl || (product.images && product.images[0]) || '/placeholder.svg',
        category: product.category || '',
        description: product.description || product.Description || '',
        parsedImages: Array.isArray(product.images) ? product.images : undefined
      } as ProductDisplay;
    })
    // If category is provided, filter products by that category
    .filter(product => !category || product.category?.toLowerCase() === category.toLowerCase());

  // Don't render the section if no products match the category
  if (formattedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 relative">
      {/* Colorful background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pastel-purple to-pastel-blue rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pastel-pink to-pastel-peach rounded-full blur-3xl opacity-30 -z-10"></div>
      
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">{title}</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple to-magenta mt-2 rounded-full"></div>
          </div>
          {link && (
            <Link 
              to={link}
              className="mt-4 md:mt-0 group inline-flex items-center font-medium text-purple hover:text-magenta transition-colors"
            >
              {linkText}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {formattedProducts.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id + index} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
