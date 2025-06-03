
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { Order } from '@/types/user.types';
import { OrderItem } from './OrderItem';
import { CurrentCart } from './CurrentCart';

interface OrdersTabProps {
  orders: Order[];
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
        <CardDescription>
          View and manage your orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">No orders yet</h3>
            <p className="text-muted-foreground">
              You haven't placed any orders yet.
            </p>
            <Button className="mt-4" asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        )}
        
        <CurrentCart />
      </CardContent>
    </Card>
  );
};
