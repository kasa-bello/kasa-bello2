
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { assignImagesToProduct } from "@/lib/assignImagesToProduct";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export const ProductImageAssignment = () => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isError, setIsError] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAssignImages = async () => {
    setIsAssigning(true);
    setIsError(false);
    setIsComplete(false);
    setProgress(0);
    
    try {
      const result = await assignImagesToProduct((progressValue) => {
        setProgress(progressValue);
      });
      
      setIsComplete(result);
      setIsError(!result);
    } catch (error) {
      console.error("Error assigning images:", error);
      setIsError(true);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-4">Product Image Assignment</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        This utility will upload and assign multiple images to the product with SKU: ABS274.
      </p>
      
      {isAssigning && (
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm">
            <span>Uploading images...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            This may take a moment depending on your internet connection.
          </p>
        </div>
      )}
      
      {isError && !isAssigning && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700 dark:text-red-300 font-medium">Upload failed</p>
          </div>
          <p className="ml-7 text-sm text-red-600 dark:text-red-300 mt-1">
            There was a problem uploading the images. Please check the console for more details.
          </p>
        </div>
      )}
      
      {isComplete && !isAssigning && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-md">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700 dark:text-green-300 font-medium">Upload complete</p>
          </div>
          <p className="ml-7 text-sm text-green-600 dark:text-green-300 mt-1">
            The product images have been successfully uploaded and assigned.
          </p>
        </div>
      )}
      
      <Button 
        onClick={handleAssignImages} 
        disabled={isAssigning}
        className="w-full"
      >
        {isAssigning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading Images...
          </>
        ) : isComplete ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Images Assigned Successfully
          </>
        ) : (
          "Assign Images to ABS274"
        )}
      </Button>
      
      {isComplete && (
        <div className="mt-4 text-center">
          <a 
            href="/product/ABS274" 
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm inline-flex items-center"
          >
            View Product Page →
          </a>
        </div>
      )}
    </div>
  );
};
