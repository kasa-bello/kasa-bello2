
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const ProductLoading = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Button disabled className="bg-primary/80">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading product details
          </Button>
          <p className="mt-4 text-sm text-gray-500">This may take a moment if loading high-resolution images</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};
