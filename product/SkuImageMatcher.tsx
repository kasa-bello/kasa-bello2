
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { assignImagesBySkuPattern } from "@/lib/assignImagesBySkuPattern";
import { Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";

export const SkuImageMatcher = () => {
  const [isMatching, setIsMatching] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isError, setIsError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);

  const handleMatchImages = async () => {
    setIsMatching(true);
    setIsError(false);
    setIsComplete(false);
    setProgress(0);
    setMatchedCount(0);
    
    toast.info("Starting SKU image matching process", {
      description: "This will associate images with products based on SKU patterns in filenames"
    });
    
    try {
      const result = await assignImagesBySkuPattern((progressValue) => {
        setProgress(progressValue);
      });
      
      // Number of successful matches would ideally come from the function
      // For now we'll just say it was successful
      setMatchedCount(result ? 1 : 0);
      setIsComplete(result);
      setIsError(!result);
    } catch (error) {
      console.error("Error matching images:", error);
      setIsError(true);
      toast.error("Error in SKU image matching process", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-4">SKU Image Matcher</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        This utility will analyze your uploaded images and match them to products based on SKU patterns in the filenames.
        Each product will only receive images that match its SKU.
      </p>
      
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">
              How this works:
            </p>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
              For each image in storage, we look for products whose SKU appears in the image filename. 
              For example, an image named "product-ABS274-front.jpg" will be matched with the product that has SKU "ABS274".
            </p>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-2">
              <strong>Naming tip:</strong> For best results, include the exact SKU in your image filenames.
            </p>
          </div>
        </div>
      </div>
      
      {isMatching && (
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm">
            <span>Matching images to products...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            This process may take some time depending on the number of products and images.
          </p>
        </div>
      )}
      
      {isError && !isMatching && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700 dark:text-red-300 font-medium">Matching failed</p>
          </div>
          <p className="ml-7 text-sm text-red-600 dark:text-red-300 mt-1">
            There was a problem matching images to products. Please check the console for more details.
          </p>
        </div>
      )}
      
      {isComplete && !isMatching && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-md">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700 dark:text-green-300 font-medium">Matching complete</p>
          </div>
          <p className="ml-7 text-sm text-green-600 dark:text-green-300 mt-1">
            Images have been successfully matched to products based on SKU patterns.
          </p>
          {matchedCount > 0 && (
            <p className="ml-7 text-sm text-green-600 dark:text-green-300 mt-1">
              The product images are now visible on the product pages.
            </p>
          )}
        </div>
      )}
      
      <Button 
        onClick={handleMatchImages} 
        disabled={isMatching}
        className="w-full"
      >
        {isMatching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Matching Images...
          </>
        ) : isComplete ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Images Matched Successfully
          </>
        ) : (
          "Match Images to Products by SKU"
        )}
      </Button>
      
      {isComplete && (
        <div className="mt-4 text-center">
          <a 
            href="/products" 
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm inline-flex items-center"
          >
            View Products →
          </a>
        </div>
      )}
    </div>
  );
};
