
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ProductImageAssignment } from "@/components/product/ProductImageAssignment";
import { SkuImageMatcher } from "@/components/product/SkuImageMatcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileImage, Laptop } from "lucide-react";

const ImageAssignment = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Image Assignment Tool</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Use this tool to assign images to products in the database.
          </p>
          
          <Tabs defaultValue="sku-matcher" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="sku-matcher" className="flex items-center">
                <FileImage className="mr-2 h-4 w-4" />
                Match by SKU
              </TabsTrigger>
              <TabsTrigger value="single-product" className="flex items-center">
                <Laptop className="mr-2 h-4 w-4" />
                Single Product
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sku-matcher">
              <SkuImageMatcher />
            </TabsContent>
            
            <TabsContent value="single-product">
              <ProductImageAssignment />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ImageAssignment;
