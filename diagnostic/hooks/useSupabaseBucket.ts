
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createProductImagesBucket } from '@/lib/storage/createBucket';

export const useSupabaseBucket = () => {
  const [isCreatingBucket, setIsCreatingBucket] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bucketInfo, setBucketInfo] = useState<any>(null);

  const handleCreateBucket = async () => {
    setIsCreatingBucket(true);
    
    try {
      const success = await createProductImagesBucket();
      
      if (success) {
        toast.success("Bucket created successfully");
        return true;
      } else {
        toast.error("Failed to create bucket");
        return false;
      }
    } catch (error) {
      console.error("Error creating bucket:", error);
      toast.error("Failed to create bucket", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      return false;
    } finally {
      setIsCreatingBucket(false);
    }
  };

  const checkBucketStatus = async () => {
    setSupabaseStatus('loading');
    
    try {
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error("Error checking Supabase storage:", bucketError);
        setSupabaseStatus('error');
        setBucketInfo({ error: bucketError.message });
        toast.error("Supabase storage error", {
          description: bucketError.message
        });
        return false;
      } else {
        setSupabaseStatus('success');
        
        // Check for product-images bucket
        const productBucket = buckets.find(b => b.name === 'product-images');
        setBucketInfo({
          buckets: buckets.map(b => b.name),
          hasProductImagesBucket: !!productBucket,
          productBucket
        });
        
        if (!productBucket) {
          toast.warning("Product images bucket not found", {
            description: "The 'product-images' bucket doesn't exist in your Supabase project"
          });
          return false;
        } else {
          // Try to list files in the bucket
          const { data: files, error: filesError } = await supabase.storage
            .from('product-images')
            .list();
            
          if (filesError) {
            console.error("Error listing files in product-images bucket:", filesError);
            setBucketInfo(prev => ({
              ...prev,
              filesError: filesError.message
            }));
            return false;
          } else {
            setBucketInfo(prev => ({
              ...prev,
              fileCount: files?.length || 0,
              files: files?.map(f => f.name).slice(0, 10) || []
            }));
            return true;
          }
        }
      }
    } catch (e) {
      console.error("Error checking bucket status:", e);
      setSupabaseStatus('error');
      setBucketInfo({ error: e instanceof Error ? e.message : "Unknown error" });
      return false;
    }
  };

  return {
    isCreatingBucket,
    supabaseStatus,
    bucketInfo,
    handleCreateBucket,
    checkBucketStatus
  };
};
