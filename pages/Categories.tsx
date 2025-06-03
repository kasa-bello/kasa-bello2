
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { categories } from "@/lib/data";

const Categories = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple/10 to-magenta/10 dark:from-purple/20 dark:to-magenta/20 py-12 md:py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Shop by Categories</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Discover our curated collections of premium furniture and home essentials for every room in your home.
            </p>
          </div>
        </div>
        
        {/* Categories Grid */}
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="group overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{category.description}</p>
                    <span className="inline-flex items-center text-primary font-medium">
                      Browse Collection
                      <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
