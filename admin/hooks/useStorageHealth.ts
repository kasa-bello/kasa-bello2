
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface StorageStatus {
  isHealthy?: boolean;
  bucketExists?: boolean;
  fileCount?: number;
  message?: string;
  error?: string;
}

export const useStorageHealth = () => {
  const [isCheckingStorage, setIsCheckingStorage] = useState(false);
  const [storageStatus, setStorageStatus] = useState<StorageStatus>({});

  const checkStorageHealth = async () => {
    setIsCheckingStorage(true);
    setStorageStatus({});

    try {
      // First check if the bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error("Error checking storage buckets:", bucketError);
        setStorageStatus({
          isHealthy: false,
          bucketExists: false,
          error: `Storage API error: ${bucketError.message}`
        });
        toast.error("Storage API error", {
          description: bucketError.message
        });
        return;
      }
      
      // Check if the product-images bucket exists
      const productBucket = buckets.find(b => b.name === 'product-images');
      
      if (!productBucket) {
        setStorageStatus({
          isHealthy: false,
          bucketExists: false,
          message: "The product-images bucket doesn't exist"
        });
        toast.error("Storage configuration issue", {
          description: "The product-images bucket doesn't exist in your Supabase project"
        });
        return;
      }
      
      // Try to list files in the bucket
      const { data: files, error: filesError } = await supabase.storage
        .from('product-images')
        .list();
        
      if (filesError) {
        console.error("Error listing files:", filesError);
        setStorageStatus({
          isHealthy: false,
          bucketExists: true,
          error: `Cannot access files: ${filesError.message}`
        });
        toast.error("Storage permission error", {
          description: "Bucket exists but cannot list files. Policy may be misconfigured."
        });
        return;
      }
      
      // Try to create a test file and then remove it
      const testContent = new Blob(['test'], { type: 'text/plain' });
      const testFile = new File([testContent], 'permission-test.txt', { type: 'text/plain' });
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(`test-${Date.now()}.txt`, testFile, {
          cacheControl: '0',
          upsert: true
        });
      
      if (uploadError) {
        console.error("Upload test failed:", uploadError);
        setStorageStatus({
          isHealthy: false,
          bucketExists: true,
          fileCount: files?.length || 0,
          error: `Upload test failed: ${uploadError.message}`
        });
        toast.error("Storage upload test failed", {
          description: "Bucket exists but upload test failed. Check permissions."
        });
        return;
      }
      
      // Clean up test file
      if (uploadData?.path) {
        await supabase.storage
          .from('product-images')
          .remove([uploadData.path]);
      }
      
      // All tests passed
      setStorageStatus({
        isHealthy: true,
        bucketExists: true,
        fileCount: files?.length || 0,
        message: "Storage is configured correctly and working"
      });
      
      toast.success("Storage is healthy", {
        description: `Bucket exists with ${files?.length || 0} files and upload test passed`
      });
    } catch (e) {
      console.error("Unexpected error in storage health check:", e);
      setStorageStatus({
        isHealthy: false,
        error: e instanceof Error ? e.message : "Unknown error checking storage"
      });
      toast.error("Storage health check failed", {
        description: "An unexpected error occurred"
      });
    } finally {
      setIsCheckingStorage(false);
    }
  };

  return {
    isCheckingStorage,
    storageStatus,
    checkStorageHealth
  };
};
