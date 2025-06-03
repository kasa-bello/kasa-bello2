import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/hooks/useUser';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ChevronDown,
  User,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const Navbar = () => {
  const { totalItems, openCart } = useCart();
  const { user, logout, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-900/90' 
          : 'bg-white dark:bg-gray-900'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link 
            to="/" 
            className="flex items-center transition-opacity duration-200 hover:opacity-80"
          >
            <img 
              src="/lovable-uploads/aa77fd5d-6929-4bef-aaa1-8f92bcdd7cd2.png" 
              alt="Kasa Bello" 
              className="h-10 md:h-12"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors hover-underline">
              Home
            </Link>
            <div className="relative group">
              <button className="flex items-center font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors">
                Categories
                <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
              </button>
              <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-50">
                <div className="p-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className="block px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/products" className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors hover-underline">
              All Products
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSearch}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <button 
              onClick={openCart}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <User className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.name}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}
            
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div 
          className={`absolute left-0 w-full bg-white dark:bg-gray-900 p-4 shadow-md transform transition-transform duration-300 ease-in-out ${
            isSearchOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'
          }`}
        >
          <div className="container mx-auto flex items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <button 
              onClick={toggleSearch}
              className="ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div 
          className={`md:hidden absolute left-0 w-full bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out shadow-md ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'
          }`}
        >
          <nav className="container mx-auto py-4 px-4">
            <div className="space-y-4">
              <Link 
                to="/" 
                className="block py-2 font-medium text-gray-800 dark:text-gray-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Categories</p>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="block py-2 pl-4 text-sm text-gray-700 dark:text-gray-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
                <Link 
                  to="/products" 
                  className="block py-2 font-medium text-gray-800 dark:text-gray-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Products
                </Link>
              </div>
              {isAuthenticated ? (
                <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
                  <Link 
                    to="/account" 
                    className="block py-2 font-medium text-gray-800 dark:text-gray-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center py-2 font-medium text-gray-800 dark:text-gray-200"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
                  <Link 
                    to="/login" 
                    className="block py-2 font-medium text-gray-800 dark:text-gray-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block py-2 font-medium text-gray-800 dark:text-gray-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
