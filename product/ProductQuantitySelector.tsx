
import React from "react";

interface ProductQuantitySelectorProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export const ProductQuantitySelector = ({ quantity, setQuantity }: ProductQuantitySelectorProps) => {
  // Handle quantity changes
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };
  
  // Decrement quantity (but not below 1)
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Increment quantity
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Quantity</h3>
      <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md w-32">
        <button 
          onClick={decrementQuantity}
          className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-md"
        >
          -
        </button>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-full px-2 py-1 text-center text-gray-900 dark:text-white bg-transparent border-0 focus:outline-none focus:ring-0"
        />
        <button 
          onClick={incrementQuantity}
          className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-md"
        >
          +
        </button>
      </div>
    </div>
  );
};
