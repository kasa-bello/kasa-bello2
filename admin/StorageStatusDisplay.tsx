
import React from "react";
import { CheckCircle2, FileWarning } from "lucide-react";
import { StorageStatus } from "./hooks/useStorageHealth";

interface StorageStatusDisplayProps {
  status: StorageStatus;
}

export const StorageStatusDisplay: React.FC<StorageStatusDisplayProps> = ({ status }) => {
  if (status.isHealthy === undefined) {
    return null;
  }

  return (
    <div className={`mt-4 p-4 rounded-md ${
      status.isHealthy 
      ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800" 
      : "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800"
    }`}>
      <div className="flex items-start">
        {status.isHealthy ? (
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
        ) : (
          <FileWarning className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
        )}
        <div>
          <p className={`font-medium ${
            status.isHealthy 
            ? "text-green-800 dark:text-green-300" 
            : "text-red-800 dark:text-red-300"
          }`}>
            {status.isHealthy 
              ? "Storage is healthy" 
              : "Storage health check failed"}
          </p>
          <div className={`text-sm mt-1 ${
            status.isHealthy 
            ? "text-green-700 dark:text-green-400" 
            : "text-red-700 dark:text-red-400"
          }`}>
            {status.bucketExists !== undefined && (
              <p className="mb-1">
                Bucket 'product-images': {status.bucketExists ? "✓ Exists" : "✗ Not found"}
              </p>
            )}
            
            {status.fileCount !== undefined && (
              <p className="mb-1">
                Found {status.fileCount} files in bucket
              </p>
            )}
            
            {status.message && (
              <p className="mb-1">{status.message}</p>
            )}
            
            {status.error && (
              <p className="mb-1 font-mono text-xs p-2 bg-red-100 dark:bg-red-900/40 rounded">
                Error: {status.error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
