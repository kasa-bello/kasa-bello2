
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectedFilesListProps {
  files: File[];
  isUploading: boolean;
  onRemoveFile: (index: number) => void;
  onClearFiles: () => void;
  onUploadFiles: () => void;
}

export const SelectedFilesList = ({
  files,
  isUploading,
  onRemoveFile,
  onClearFiles,
  onUploadFiles
}: SelectedFilesListProps) => {
  if (files.length === 0) return null;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Selected Files: {files.length}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFiles}
            disabled={isUploading}
          >
            Clear All
          </Button>
          <Button
            size="sm"
            onClick={onUploadFiles}
            disabled={isUploading}
          >
            Upload All Selected
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {files.map((file, index) => (
          <div key={index} className="border rounded-md p-2 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
            <div className="truncate flex-1">
              <p className="truncate text-sm">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0"
              onClick={() => onRemoveFile(index)}
              disabled={isUploading}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
