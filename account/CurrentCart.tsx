
import React from 'react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Trash2 } from 'lucide-react';

export const CurrentCart = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Cart</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">Your cart is empty</h3>
          <p className="text-muted-foreground">
            Add some products to your cart to see them here.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/products">Start Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-16 h-16 object-cover rounded-md" 
                  />
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center border rounded-md">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2"
                    >
                      −
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2"
                    >
                      +
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <Separator />
      <CardFooter className="justify-between pt-4">
        <div className="text-lg font-semibold">Total:</div>
        <div className="text-lg font-semibold">${subtotal.toFixed(2)}</div>
      </CardFooter>
    </Card>
  );
};
