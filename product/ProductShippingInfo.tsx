
import { Truck, Package, RotateCcw } from "lucide-react";

export const ProductShippingInfo = () => {
  return (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
      <div className="flex items-start space-x-3">
        <Truck className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
        <div>
          <p className="font-medium text-gray-900 dark:text-white">Free Shipping</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">On orders over $75. Order now and get it in 3-5 business days.</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <Package className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
        <div>
          <p className="font-medium text-gray-900 dark:text-white">Easy Assembly</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Simple instructions and all necessary tools included.</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
        <div>
          <p className="font-medium text-gray-900 dark:text-white">30-Day Returns</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Not satisfied? Return within 30 days for a full refund.</p>
        </div>
      </div>
    </div>
  );
};
