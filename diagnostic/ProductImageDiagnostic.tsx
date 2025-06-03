
import React from 'react';
import { Card } from '@/components/ui/card';
import { SupabaseStatus } from './SupabaseStatus';
import { ImageTestResults } from './ImageTestResults';
import { ActionButtons } from './ActionButtons';
import { useImageDiagnostic } from './useImageDiagnostic';

export const ProductImageDiagnostic: React.FC = () => {
  const {
    isCheckingImages,
    isCreatingBucket,
    testResults,
    supabaseStatus,
    bucketInfo,
    handleCreateBucket,
    checkProductImages
  } = useImageDiagnostic();
  
  return (
    <Card className="p-4 mb-6 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Product Image Diagnostic</h2>
        <ActionButtons 
          bucketInfo={bucketInfo}
          isCheckingImages={isCheckingImages}
          isCreatingBucket={isCreatingBucket}
          onCreateBucket={handleCreateBucket}
          onCheckImages={checkProductImages}
        />
      </div>
      
      <SupabaseStatus 
        status={supabaseStatus} 
        bucketInfo={bucketInfo} 
      />
      
      <ImageTestResults results={testResults} />
    </Card>
  );
};
