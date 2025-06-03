import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAllStorageImages } from "@/lib/storage/deleteUtils";

export const StorageCleanup = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    deletedCount?: number;
    error?: string;
  }>({});

  const handleDeleteAllImages = async () => {
    if (isDeleting) return;
    
    // Confirm before proceeding
    const confirmed = window.confirm(
      "WARNING: This will permanently delete ALL images from the product-images bucket. This action cannot be undone. Are you sure you want to continue?"
    );
    
    if (!confirmed) return;
    
    setIsDeleting(true);
    setResult({});
    
    try {
      toast.info("Deleting all images from storage", {
        description: "This may take a moment...",
      });
      
      const result = await deleteAllStorageImages();
      
      setResult(result);
      
      if (result.success) {
        toast.success(`Storage cleanup complete`, {
          description: `Successfully deleted ${result.deletedCount} images`,
        });
      } else {
        toast.error("Storage cleanup failed", {
          description: result.error || "An unknown error occurred",
        });
      }
    } catch (error) {
      console.error("Error in handleDeleteAllImages:", error);
      
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      });
      
      toast.error("Storage cleanup failed", {
        description: "Unexpected error during deletion",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-4">Storage Cleanup</h2>
      
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Use this tool to delete all images from the product-images storage bucket. This is useful when you want to start fresh after changing policies or fixing configuration issues.
        </p>
        
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-md mb-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-amber-800 dark:text-amber-300 text-sm">
              <strong>Warning:</strong> This will permanently delete ALL images from the product-images storage bucket. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      
      <Button
        variant="destructive"
        size="lg"
        className="w-full"
        onClick={handleDeleteAllImages}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Deleting Images...
          </>
        ) : (
          <>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All Images from Storage
          </>
        )}
      </Button>
      
      {result.success !== undefined && (
        <div className={`mt-4 p-4 rounded-md ${
          result.success 
          ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800" 
          : "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800"
        }`}>
          <div className="flex items-start">
            {result.success ? (
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
            )}
            <div>
              <p className={`font-medium ${
                result.success 
                ? "text-green-800 dark:text-green-300" 
                : "text-red-800 dark:text-red-300"
              }`}>
                {result.success 
                  ? "Storage cleanup complete" 
                  : "Storage cleanup failed"}
              </p>
              <p className={`text-sm mt-1 ${
                result.success 
                ? "text-green-700 dark:text-green-400" 
                : "text-red-700 dark:text-red-400"
              }`}>
                {result.success 
                  ? `Successfully deleted ${result.deletedCount} images.` 
                  : result.error || "An unknown error occurred during deletion."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
