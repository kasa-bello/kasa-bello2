import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Database, DownloadCloud, FileUp, Image } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ImportHeader } from "@/components/product-import/ImportHeader";
import { CSVImportTab } from "@/components/product-import/CSVImportTab";
import { DropboxImageImportTab } from "@/components/product-import/DropboxImageImportTab";
import { LocalImageImportTab } from "@/components/product-import/LocalImageImportTab";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const ProductImport = () => {
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [hasConnectionError, setHasConnectionError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [bucketExists, setBucketExists] = useState(false);

  // Add a warning if Supabase storage isn't properly configured
  useEffect(() => {
    // Check if we can access Supabase
    const checkSupabaseConnection = async () => {
      setIsCheckingConnection(true);
      setErrorDetails(null);
      
      try {
        // Use the Supabase client to check if the product-images bucket exists
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          console.error("Supabase storage connection check failed:", bucketsError);
          setHasConnectionError(true);
          setErrorDetails(bucketsError.message);
          toast.error("Storage connection error", {
            description: "Could not connect to image storage. Please check your Supabase configuration."
          });
          return;
        }
        
        // Check if the product-images bucket exists
        const productImagesBucket = buckets.find(bucket => bucket.name === 'product-images');
        
        if (!productImagesBucket) {
          console.log("Product-images bucket not found in client-side check.");
          setErrorDetails("Product-images bucket not found. It should be created via SQL.");
          setHasConnectionError(true);
          setBucketExists(false);
          toast.error("Storage configuration issue", {
            description: "Product-images bucket not found. Please ensure it's properly created with SQL."
          });
          return;
        }
        
        console.log("Successfully connected to product-images bucket");
        setBucketExists(true);
        
        // Verify we can list files in the bucket to confirm permissions are working
        const { data: files, error: filesError } = await supabase.storage
          .from('product-images')
          .list();
          
        if (filesError) {
          console.error("Error listing files in product-images bucket:", filesError);
          setErrorDetails(`Bucket exists but cannot access files: ${filesError.message}`);
          setHasConnectionError(true);
          toast.error("Storage permission error", {
            description: "Cannot list files in product-images bucket. Permission issue may exist."
          });
          return;
        }
        
        console.log("Successfully listed files in product-images bucket:", files);
        
        // Successfully connected and verified permissions
        toast.success("Storage ready", {
          description: "Connected to product images storage successfully."
        });
        
        setHasConnectionError(false);
      } catch (e) {
        console.error("Error checking Supabase connection:", e);
        setHasConnectionError(true);
        setErrorDetails(e instanceof Error ? e.message : "Unknown error occurred");
        toast.error("Storage connection error", {
          description: "There was a problem connecting to image storage."
        });
      } finally {
        setIsCheckingConnection(false);
      }
    };
    
    checkSupabaseConnection();
  }, []);

  const retryConnection = () => {
    setIsCheckingConnection(true);
    // Re-trigger the connection check
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="bg-gray-50 dark:bg-gray-900 py-12 md:py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <ImportHeader />
            
            {isCheckingConnection ? (
              <div className="max-w-2xl">
                <Skeleton className="h-12 w-full mb-6" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            ) : hasConnectionError ? (
              <div className="max-w-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded p-6">
                <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Connection Error</h3>
                <p className="mt-2 text-red-700 dark:text-red-400">
                  Unable to connect to Supabase storage. Please check your connection and configuration.
                </p>
                
                {errorDetails && (
                  <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/40 rounded text-sm">
                    <p className="font-mono text-red-800 dark:text-red-300">Error: {errorDetails}</p>
                  </div>
                )}
                
                <div className="mt-4 space-y-4">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded">
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      <strong>Troubleshooting:</strong> Make sure Supabase is properly configured. The product-images bucket 
                      {bucketExists ? " exists but may have incorrect permissions." : " needs to be created."}
                    </p>
                  </div>
                  
                  <Button onClick={retryConnection} className="w-full">
                    Retry Connection
                  </Button>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="csv" className="max-w-2xl">
                <TabsList className="mb-6">
                  <TabsTrigger value="csv" className="flex items-center">
                    <FileUp className="mr-2 h-4 w-4" />
                    CSV Import
                  </TabsTrigger>
                  <TabsTrigger value="local-images" className="flex items-center">
                    <Image className="mr-2 h-4 w-4" />
                    Computer Upload
                  </TabsTrigger>
                  <TabsTrigger value="dropbox-images" className="flex items-center">
                    <DownloadCloud className="mr-2 h-4 w-4" />
                    Dropbox Import
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="csv" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <CSVImportTab />
                </TabsContent>
                
                <TabsContent value="local-images" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <LocalImageImportTab />
                </TabsContent>
                
                <TabsContent value="dropbox-images" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <DropboxImageImportTab />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductImport;
