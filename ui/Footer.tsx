
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  CreditCard, 
  Shield, 
  Truck,
  ChevronRight
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-12 pb-6">
      <div className="container px-4 md:px-6">
        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-200 dark:border-gray-800 pb-10 mb-10">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-1">Free Shipping</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">On all orders over $99</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">100% secure transactions</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-1">Easy Returns</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">30-day return policy</p>
            </div>
          </div>
        </div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <h2 className="text-xl font-bold mb-4">Kasa Bello Select</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Curated furniture and home essentials for modern living. Quality products that blend style, comfort, and functionality.
            </p>
            
            <div className="flex space-x-3 mt-6">
              <a 
                href="#" 
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm transition-transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-primary" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm transition-transform hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-primary" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm transition-transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Shopping</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary inline-flex items-center hover-underline">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/category/furniture" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary inline-flex items-center hover-underline">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Furniture
                </Link>
              </li>
              <li>
                <Link to="/category/outdoor" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary inline-flex items-center hover-underline">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Outdoor
                </Link>
              </li>
              <li>
                <Link to="/category/bedroom" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary inline-flex items-center hover-underline">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Bedroom
                </Link>
              </li>
              <li>
                <Link to="/category/kitchen" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary inline-flex items-center hover-underline">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Kitchen
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary inline-flex items-center hover-underline">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary inline-flex items-center hover-underline">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary inline-flex items-center hover-underline">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary inline-flex items-center hover-underline">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary inline-flex items-center hover-underline">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  1250 Main Street, Suite 100<br />
                  Portland, OR 97204
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  (800) 555-1234
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  support@kasabello.com
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Kasa Bello Select. All rights reserved.
            <span className="mx-2">|</span>
            <a href="/privacy" className="hover:text-primary hover-underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
