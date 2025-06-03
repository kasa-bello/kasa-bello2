
import { Link } from "react-router-dom";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";

export const ProductNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-500 mb-4">Product not found</p>
          <Link to="/products">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};
