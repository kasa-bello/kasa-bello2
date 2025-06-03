
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, X } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/context/CartContext';

export const CartDrawer = () => {
  const { cartItems, isCartOpen, closeCart, removeFromCart, updateQuantity, subtotal } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader className="px-1">
          <div className="flex items-center justify-between">
            <SheetTitle>Shopping Cart</SheetTitle>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        <Separator className="my-4" />
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="mx-auto mb-4 rounded-full bg-primary/10 p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
            <h3 className="mb-1 text-xl font-semibold">Your cart is empty</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Add items to your cart to checkout
            </p>
            <Button asChild onClick={closeCart}>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-1">
              <div className="space-y-4 pb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded overflow-hidden bg-gray-100">
                      <img
                        src={item.imageUrl || '/placeholder.svg'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium line-clamp-1">{item.title}</h4>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 h-8"
                            aria-label="Decrease quantity"
                          >
                            −
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 h-8"
                            aria-label="Increase quantity"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="space-y-4 pt-4">
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <SheetFooter className="flex flex-col gap-2 sm:flex-col">
                <Button asChild onClick={closeCart} className="w-full">
                  <Link to="/checkout">Checkout</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  onClick={closeCart}
                  className="w-full"
                >
                  <Link to="/cart">View Cart</Link>
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
