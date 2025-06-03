
import React, { memo, useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { ProductDisplay, CartItem } from '@/types/product.types';
import { toast } from 'sonner';

interface ProductCardProps {
  product: ProductDisplay;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
  const { addToCart } = useCart();
  const [hasImageError, setHasImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // Set initial image URL
  useEffect(() => {
    let initialImage = '/placeholder.svg';
    
    if (product.parsedImages && product.parsedImages.length > 0) {
      initialImage = product.parsedImages[0];
    } else if (product.imageUrl && product.imageUrl !== '/placeholder.svg') {
      initialImage = product.imageUrl;
    }
    
    setImageUrl(initialImage);
  }, [product]);
  
  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      imageUrl: hasImageError ? '/placeholder.svg' : (imageUrl || '/placeholder.svg'),
    };
    
    addToCart(cartItem);
    toast.success(`${product.title} added to cart`);
  };

  // Image error handling
  const handleImageError = () => {
    console.error(`Image failed to load: ${imageUrl} for product ${product.id}`);
    setHasImageError(true);
    
    // Try using a different image if available
    if (product.parsedImages && product.parsedImages.length > 1) {
      // Try the second image if the first one fails
      setImageUrl(product.parsedImages[1]);
    } else {
      // Use placeholder if no other images are available
      setImageUrl('/placeholder.svg');
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Link to={`/product/${product.id}`} className="overflow-hidden">
        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={product.title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
            loading="lazy"
            onError={handleImageError}
          />
        </div>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-lg mb-2 hover:underline line-clamp-2">{product.title}</h3>
        </Link>
        <div className="flex flex-col">
          <p className="text-lg font-semibold">${product.price?.toFixed(2)}</p>
          {product.category && (
            <span className="text-sm text-gray-500 mt-1">{product.category}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
});

// Add display name for better debugging
ProductCard.displayName = "ProductCard";
