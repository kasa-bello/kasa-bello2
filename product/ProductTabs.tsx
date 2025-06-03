
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";

interface ProductTabsProps {
  description: string;
  product: any;
  isMockProduct: boolean;
}

export const ProductTabs = ({ description, product, isMockProduct }: ProductTabsProps) => {
  return (
    <div className="container px-4 md:px-6 py-8 border-t border-gray-200 dark:border-gray-800">
      <Tabs defaultValue="description">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="py-6">
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <p>{description}</p>
          </div>
        </TabsContent>
        <TabsContent value="specifications" className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Dimensions</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex justify-between">
                  <span>Width</span>
                  <span>{isMockProduct && product.Width ? product.Width : "24"} inches</span>
                </li>
                <li className="flex justify-between">
                  <span>Height</span>
                  <span>{isMockProduct && product.Height ? product.Height : "36"} inches</span>
                </li>
                <li className="flex justify-between">
                  <span>Depth</span>
                  <span>{isMockProduct && product.Depth ? product.Depth : "18"} inches</span>
                </li>
                <li className="flex justify-between">
                  <span>Weight</span>
                  <span>{isMockProduct && product["product-weight"] ? product["product-weight"] : "15"} lbs</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Materials</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex justify-between">
                  <span>Frame</span>
                  <span>Solid Oak</span>
                </li>
                <li className="flex justify-between">
                  <span>Finish</span>
                  <span>Natural Matte</span>
                </li>
                <li className="flex justify-between">
                  <span>Hardware</span>
                  <span>Brushed Brass</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="py-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-1">Customer Reviews</h3>
              <div className="flex items-center space-x-1">
                <div className="flex">
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
                </div>
                <span>4.0 out of 5</span>
                <span className="text-gray-600 dark:text-gray-400">(24 reviews)</span>
              </div>
            </div>
            
            <div>
              <p className="text-gray-600 dark:text-gray-400">No reviews available for this product yet.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
