
import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface SupabaseStatusProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  bucketInfo: any;
}

export const SupabaseStatus: React.FC<SupabaseStatusProps> = ({ status, bucketInfo }) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Supabase Storage Status:</h3>
      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
        {status === 'idle' && (
          <p className="text-sm text-gray-500">Click "Check Images" to test Supabase storage</p>
        )}
        
        {status === 'loading' && (
          <div className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin text-blue-500" />
            <span className="text-sm">Checking Supabase storage...</span>
          </div>
        )}
        
        {status === 'success' && (
          <div className="space-y-2">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-sm text-green-700 dark:text-green-400">
                Connected to Supabase storage
              </span>
            </div>
            
            {bucketInfo && <BucketDetails bucketInfo={bucketInfo} />}
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-400">
              Error connecting to Supabase storage: {bucketInfo?.error}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

interface BucketDetailsProps {
  bucketInfo: any;
}

const BucketDetails: React.FC<BucketDetailsProps> = ({ bucketInfo }) => {
  return (
    <div className="text-xs">
      <p className="mt-1">
        Available buckets: {bucketInfo.buckets?.join(', ') || 'None'}
      </p>
      
      {bucketInfo.hasProductImagesBucket ? (
        <p className="mt-1 text-green-600 dark:text-green-400">
          ✓ 'product-images' bucket exists 
          {bucketInfo.fileCount !== undefined && ` (${bucketInfo.fileCount} files)`}
        </p>
      ) : (
        <p className="mt-1 text-red-600 dark:text-red-400">
          ✗ 'product-images' bucket doesn't exist - click "Create Bucket" to fix this
        </p>
      )}
      
      {bucketInfo.files && bucketInfo.files.length > 0 && (
        <p className="mt-1">
          Sample files: {bucketInfo.files.join(', ')}
        </p>
      )}
      
      {bucketInfo.filesError && (
        <p className="mt-1 text-red-600 dark:text-red-400">
          Error listing files: {bucketInfo.filesError}
        </p>
      )}
    </div>
  );
};
