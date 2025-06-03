
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Share2, Star, Truck, Package, RotateCcw } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ProductQuantitySelector } from "./ProductQuantitySelector";
import { ProductFeatures } from "./ProductFeatures";
import { ProductShippingInfo } from "./ProductShippingInfo";

interface ProductInfoProps {
  product: any;
  isMockProduct: boolean;
  title: string;
  price: number;
  description: string;
  features: string[];
  images: string[];
}

export const ProductInfo = ({ 
  product, 
  isMockProduct, 
  title, 
  price, 
  description, 
  features,
  images
}: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  // Handle add to cart
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: isMockProduct ? product.title : (product.title || 'Untitled Product'),
      price: isMockProduct ? product.price : (product.price || 0),
      quantity,
      imageUrl: images.length > 0 ? images[0] : '/placeholder.svg'
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-5 h-5 ${
                  star <= 4 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300 dark:text-gray-600'
                }`} 
              />
            ))}
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              4.0 (24 reviews)
            </span>
          </div>
          <span className="text-sm text-green-600 dark:text-green-400">
            In stock
          </span>
        </div>
      </div>
      
      <div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          ${price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Free shipping on orders over $75
        </p>
      </div>
      
      <div>
        <p className="text-gray-700 dark:text-gray-300">
          {description}
        </p>
      </div>
      
      {/* Features */}
      <ProductFeatures features={features} />
      
      {/* Quantity Selector */}
      <ProductQuantitySelector 
        quantity={quantity} 
        setQuantity={setQuantity} 
      />
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleAddToCart}
          className="flex-1 rounded-full"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" /> 
          Add to Cart
        </Button>
        <Button 
          variant="outline"
          className="flex-1 rounded-full"
          size="lg"
        >
          <Heart className="mr-2 h-5 w-5" />
          Add to Wishlist
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Shipping Info */}
      <ProductShippingInfo />
    </div>
  );
};
