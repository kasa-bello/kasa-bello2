
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-20 pb-10 md:pt-32 md:pb-20 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="max-w-xl">
            <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <span className="inline-block bg-gradient-to-r from-purple/20 to-magenta/20 text-magenta text-sm font-medium px-3 py-1 rounded-full mb-4">
                Premium Selection
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4 animate-fade-in opacity-0 gradient-text" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Elevate Your Space with Curated Design
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              Discover exceptional furniture and home essentials selected for quality, design, and functionality. Transform your living spaces with our premium collections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <Button asChild size="lg" className="font-medium bg-gradient-to-r from-purple to-magenta hover:opacity-90 transition-opacity">
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-medium border-purple hover:bg-purple/10">
                <Link to="/categories">
                  Explore Categories
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative animate-fade-in opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pastel-purple via-pastel-pink to-pastel-blue rounded-2xl blur-3xl opacity-30 transform -rotate-6"></div>
            
            <div className="aspect-[4/3] rounded-lg overflow-hidden border-2 border-purple/20 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="Modern living room furniture" 
                className="w-full h-full object-cover animate-scale-in opacity-0"
                style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
                onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
              />
            </div>
            
            <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 w-40 h-40 md:w-60 md:h-60 rounded-lg overflow-hidden shadow-lg animate-float border-2 border-purple/20">
              <img 
                src="https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="Home accent decoration" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-purple/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-teal/10 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>
    </section>
  );
};
