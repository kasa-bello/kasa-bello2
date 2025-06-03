
import { useState, useEffect } from 'react';
import { createProductImagesBucket } from '@/lib/storage/createBucket';
import { getStorageInfo } from '@/lib/storage/helperUtils';
import { useImageTesting } from './hooks/useImageTesting';

export const useImageDiagnostic = () => {
  const [supabaseStatus, setSupabaseStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bucketInfo, setBucketInfo] = useState<any>(null);
  const [isCreatingBucket, setIsCreatingBucket] = useState<boolean>(false);
  const { isCheckingImages, testResults, testProductImages } = useImageTesting();
  
  // Initial check for Supabase storage status
  useEffect(() => {
    checkSupabaseStorage();
  }, []);
  
  /**
   * Check Supabase storage configuration
   */
  const checkSupabaseStorage = async () => {
    setSupabaseStatus('loading');
    
    try {
      const info = await getStorageInfo();
      
      if (info.error) {
        console.error("Supabase storage error:", info);
        setSupabaseStatus('error');
        setBucketInfo({
          error: info.error,
          buckets: info.buckets || []
        });
        return;
      }
      
      console.log("Supabase storage info:", info);
      
      setSupabaseStatus('success');
      setBucketInfo({
        hasProductImagesBucket: Boolean(info.bucket),
        buckets: info.buckets || [],
        files: info.files?.slice(0, 3)?.map(f => f.name),
        fileCount: info.files?.length || 0
      });
    } catch (e) {
      console.error("Error checking Supabase storage:", e);
      setSupabaseStatus('error');
      setBucketInfo({
        error: e instanceof Error ? e.message : "Unknown error"
      });
    }
  };
  
  /**
   * Create the product-images bucket in Supabase storage
   */
  const handleCreateBucket = async () => {
    setIsCreatingBucket(true);
    
    try {
      await createProductImagesBucket();
      await checkSupabaseStorage(); // Refresh status after bucket creation
    } catch (e) {
      console.error("Error creating bucket:", e);
    } finally {
      setIsCreatingBucket(false);
    }
  };
  
  /**
   * Test if product images can be loaded
   */
  const checkProductImages = async () => {
    await checkSupabaseStorage(); // First refresh Supabase status
    await testProductImages(); // Then test product images
  };
  
  return {
    isCheckingImages,
    isCreatingBucket,
    testResults,
    supabaseStatus,
    bucketInfo,
    handleCreateBucket,
    checkProductImages
  };
};
