
import React from "react";
import { StorageActionButton } from "./StorageActionButton";
import { StorageStatusDisplay } from "./StorageStatusDisplay";
import { useStorageHealth } from "./hooks/useStorageHealth";

export const StorageTools = () => {
  const { isCheckingStorage, storageStatus, checkStorageHealth } = useStorageHealth();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
      <h2 className="text-2xl font-semibold mb-4">Storage Health Check</h2>
      
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Use this tool to check if your Supabase storage is configured correctly and working properly. 
          This will verify bucket existence, permissions, and run a test upload.
        </p>
      </div>
      
      <StorageActionButton 
        isLoading={isCheckingStorage} 
        onClick={checkStorageHealth} 
      />
      
      <StorageStatusDisplay status={storageStatus} />
    </div>
  );
};
