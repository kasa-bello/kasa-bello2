
import React from 'react';
import { RefreshCw, CheckCircle2, X, ExternalLink, AlertTriangle, Info } from 'lucide-react';
import { ImageUrlTestResult } from './hooks/useImageUrlTester';
import { Badge } from '@/components/ui/badge';

interface ImageTestResultsProps {
  results: ImageUrlTestResult[];
}

export const ImageTestResults: React.FC<ImageTestResultsProps> = ({ results }) => {
  if (results.length === 0) return null;

  // Count test results by status
  const countByStatus = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get summary stats
  const successCount = countByStatus.success || 0;
  const errorCount = countByStatus.error || 0;
  const loadingCount = countByStatus.loading || 0;
  const totalCount = results.length;
  
  // Check if there are retries in successful results
  const hasRetries = results.some(r => r.status === 'success' && r.retryCount && r.retryCount > 0);

  return (
    <div className="rounded-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Image URL Tests</h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {totalCount} {totalCount === 1 ? 'URL' : 'URLs'} tested
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        {successCount > 0 && (
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
            <span>Success: {successCount}</span>
          </Badge>
        )}
        {errorCount > 0 && (
          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800">
            <X className="h-3 w-3 mr-1 text-red-500" />
            <span>Failed: {errorCount}</span>
          </Badge>
        )}
        {loadingCount > 0 && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            <RefreshCw className="h-3 w-3 mr-1 text-blue-500 animate-spin" />
            <span>Loading: {loadingCount}</span>
          </Badge>
        )}
        {hasRetries && (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 border-amber-200 dark:border-amber-800">
            <Info className="h-3 w-3 mr-1 text-amber-500" />
            <span>Some images needed retries</span>
          </Badge>
        )}
      </div>
      
      {/* Detailed Results */}
      <div className="space-y-2 max-h-60 overflow-auto pr-2">
        {results.map((result, index) => (
          <ResultItem key={index} result={result} />
        ))}
      </div>
      
      {/* Help text if there are errors */}
      {errorCount > 0 && <ErrorHelp />}
    </div>
  );
};

// Separated components for better organization
const ResultItem = ({ result }: { result: ImageUrlTestResult }) => {
  const statusColors = {
    loading: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800',
    success: 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800'
  };
  
  return (
    <div 
      className={`p-2 text-xs rounded-md flex items-start border ${statusColors[result.status]}`}
    >
      <StatusIcon status={result.status} />
      
      <div className="overflow-hidden flex-1">
        <div className="flex items-center">
          <span className="truncate font-mono">
            {result.url.length > 45 
              ? result.url.substring(0, 42) + "..." 
              : result.url
            }
          </span>
          <a 
            href={result.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-1 text-blue-500 hover:text-blue-600"
            aria-label="Open in new tab"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        
        {result.retryCount && result.retryCount > 0 && result.status === 'success' && (
          <p className="text-amber-500 mt-1 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Succeeded after {result.retryCount} {result.retryCount === 1 ? 'retry' : 'retries'}
          </p>
        )}
        
        {result.error && (
          <p className="text-red-500 mt-1 text-[11px] break-words">{result.error}</p>
        )}
      </div>
    </div>
  );
};

const StatusIcon = ({ status }: { status: 'loading' | 'success' | 'error' }) => {
  if (status === 'loading') {
    return <RefreshCw className="h-4 w-4 mr-2 animate-spin text-blue-500 flex-shrink-0" />;
  } else if (status === 'success') {
    return <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />;
  } else {
    return <X className="h-4 w-4 mr-2 text-red-500 flex-shrink-0" />;
  }
};

const ErrorHelp = () => {
  return (
    <div className="mt-3 text-xs p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-md">
      <div className="flex items-center text-amber-800 dark:text-amber-300">
        <AlertTriangle className="h-3 w-3 mr-1" />
        <span className="font-medium">Troubleshooting tips:</span>
      </div>
      <ul className="mt-1 list-disc list-inside text-amber-700 dark:text-amber-300 space-y-1">
        <li>Check if image URLs are accessible from your current network</li>
        <li>Verify CORS settings on the image server</li>
        <li>Ensure image URLs use https:// or a valid relative path</li>
        <li>For Supabase storage, check bucket permissions and policies</li>
        <li>Verify that your image paths in the database are correct</li>
      </ul>
    </div>
  );
};
