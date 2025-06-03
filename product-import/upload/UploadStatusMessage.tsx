
import { XCircle, AlertTriangle, Info } from "lucide-react";

interface UploadStatusMessageProps {
  errorMessage: string | null;
  detailedErrors: string[];
  uploadAttempts: number;
  uploadedImages: string[];
  isUploading: boolean;
}

export const UploadStatusMessage = ({
  errorMessage,
  detailedErrors,
  uploadAttempts,
  uploadedImages,
  isUploading,
}: UploadStatusMessageProps) => {
  // No status message to show
  if (!errorMessage && !(uploadAttempts > 0 && uploadedImages.length === 0 && !isUploading)) {
    return null;
  }

  // Error message display
  if (errorMessage) {
    return (
      <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-md">
        <div className="flex items-center">
          <XCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700 dark:text-red-300 font-medium">Upload Error</p>
        </div>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
        
        {detailedErrors.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">Detailed errors:</p>
            <ul className="mt-1 text-xs text-red-600 dark:text-red-400 list-disc list-inside space-y-1 max-h-40 overflow-y-auto">
              {detailedErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // No uploads were successful
  if (uploadAttempts > 0 && uploadedImages.length === 0 && !isUploading) {
    return (
      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-md">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
          <p className="text-amber-700 dark:text-amber-300 font-medium">No images were uploaded</p>
        </div>
        <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
          Check that you are selecting individual image files (not folders) and that the Supabase storage is configured correctly.
        </p>
      </div>
    );
  }

  return null;
};
