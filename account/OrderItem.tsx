
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/types/user.types';

interface OrderItemProps {
  order: Order;
}

export const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  return (
    <div className="bg-muted p-4 rounded-lg">
      <div className="flex flex-wrap justify-between gap-2 mb-4">
        <div>
          <h3 className="font-medium">Order #{order.id}</h3>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.date).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium">${order.total.toFixed(2)}</p>
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            order.status === 'delivered' 
              ? 'bg-green-100 text-green-800' 
              : order.status === 'processing'
              ? 'bg-blue-100 text-blue-800'
              : order.status === 'shipped'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between gap-2">
            <div>
              <p>{item.title} x{item.quantity}</p>
            </div>
            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button size="sm" variant="outline">View Details</Button>
      </div>
    </div>
  );
};
