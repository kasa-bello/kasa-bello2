
import { Info } from "lucide-react";

export const FileRequirementsInfo = () => {
  return (
    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
      <div className="flex items-center">
        <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
        <div>
          <p className="text-blue-700 dark:text-blue-300 font-medium">File requirements:</p>
          <ul className="mt-1 text-sm text-blue-600 dark:text-blue-400 list-disc list-inside space-y-1">
            <li>Image files only (JPG, PNG, GIF, etc.)</li>
            <li>Maximum size: 10MB per image</li>
            <li>You can select individual files or entire folders</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
