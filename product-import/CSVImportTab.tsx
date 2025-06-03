
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileUp, Upload, AlertTriangle, Loader2 } from "lucide-react";
import { importProductsFromFile, importProductsToSupabase } from "@/lib/import/fileImporter";

export const CSVImportTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [importedProducts, setImportedProducts] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<"idle" | "parsing" | "importing">("idle");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setImportedProducts(null);
    setIsLoading(true);
    setStage("parsing");

    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileType || '')) {
      toast.error("Invalid file format", {
        description: "Please upload a CSV or Excel (.xlsx, .xls) file"
      });
      setIsLoading(false);
      setStage("idle");
      return;
    }

    try {
      // Parse the file to get products
      const products = await importProductsFromFile(file);
      
      // Update stage to importing
      setStage("importing");
      
      // Import products to Supabase (with image uploading)
      const importedCount = await importProductsToSupabase(products);
      
      setImportedProducts(importedCount);
      toast.success("Products imported successfully", {
        description: `${importedCount} products have been imported to Supabase`
      });
    } catch (error) {
      console.error("Import error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to import products";
      setError(errorMessage);
      toast.error("Import failed", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
      setStage("idle");
      // Reset the input
      event.target.value = "";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Product Import</h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Upload a CSV or Excel file with your product data. The following columns are required:
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded p-4 mb-6">
          <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Required Columns:</h3>
          <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li><strong>title</strong> - Product name</li>
            <li><strong>description</strong> - Product description</li>
            <li><strong>price</strong> - Numerical value</li>
            <li><strong>category</strong> - Product category</li>
          </ul>
          <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
            Optional columns: images (comma-separated URLs), features, rating, reviewCount, stock
          </p>
        </div>
        
        {error && (
          <div className="border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-300">Import Error</h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 rounded p-4 mb-6">
            <div className="flex items-start">
              <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 animate-spin" />
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-300">
                  {stage === "parsing" ? "Parsing File..." : "Importing Products..."}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  {stage === "parsing" 
                    ? "Reading and validating your file data. This may take a moment for large files."
                    : "Uploading products to the database. Please don't close this page."
                  }
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
          <p className="mb-4 font-medium">Drag and drop your file, or click to browse</p>
          
          <label className="relative">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
            />
            <Button disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {stage === "parsing" ? "Parsing..." : "Importing..."}
                </>
              ) : "Select File"}
            </Button>
          </label>
        </div>
      </div>
      
      {importedProducts !== null && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded p-4 text-green-800 dark:text-green-300">
          <p className="font-medium">Import completed!</p>
          <p className="text-sm">{importedProducts} products were successfully imported.</p>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded text-amber-800 dark:text-amber-300">
        <h3 className="font-medium mb-2">File Format Examples:</h3>
        <p className="text-sm mb-2"><strong>CSV Example:</strong></p>
        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
          title,description,price,category,images<br/>
          "Modern Sofa","A comfortable sofa",599.99,furniture,"https://example.com/image1.jpg,https://example.com/image2.jpg"<br/>
          "Desk Lamp","LED desk lamp",49.99,lighting,"https://example.com/lamp.jpg"
        </pre>
        <p className="text-sm mt-3 mb-2"><strong>Excel:</strong> Create a spreadsheet with the same columns and save as .xlsx or .xls</p>
      </div>
    </div>
  );
};
