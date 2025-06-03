
import { useState } from 'react';

export interface ImageUrlTestResult {
  url: string;
  status: 'loading' | 'success' | 'error';
  error?: string;
  retryCount?: number;
}

export const useImageUrlTester = () => {
  const [testResults, setTestResults] = useState<ImageUrlTestResult[]>([]);
  const MAX_RETRIES = 2; // Maximum number of retry attempts
  const TIMEOUT_MS = 8000; // 8 seconds timeout

  const testImageUrl = async (url: string, index: number, retryCount = 0): Promise<boolean> => {
    try {
      console.log(`Testing image URL (${index}), attempt ${retryCount + 1}:`, url);
      
      // Normalize the URL for testing
      const testUrl = url.startsWith('/') 
        ? `${window.location.origin}${url}` // Handle relative URLs
        : url;
      
      // Use HEAD request first, but fallback to GET if needed
      let response;
      try {
        response = await fetch(testUrl, { 
          method: 'HEAD',
          // Add a timeout for the request
          signal: AbortSignal.timeout(TIMEOUT_MS)
        });
      } catch (headError) {
        console.log(`HEAD request failed for ${url}, trying GET`);
        response = await fetch(testUrl, { 
          method: 'GET',
          // Add a timeout for the request
          signal: AbortSignal.timeout(TIMEOUT_MS)
        });
      }
      
      console.log(`Response for ${url}:`, {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText
      });
      
      // Check specifically for image content type
      const contentType = response.headers.get('content-type');
      const isImageContent = contentType && contentType.startsWith('image/');
      
      // For GET requests we should verify we got an image back, but for HEAD we rely on status
      const isValidImage = response.method === 'HEAD' ? response.ok : (response.ok && isImageContent);
      
      let errorMessage = undefined;
      if (!response.ok) {
        errorMessage = `HTTP ${response.status}: ${response.statusText || 'Unknown error'}`;
      } else if (response.method === 'GET' && !isImageContent && response.status !== 204) {
        errorMessage = `Not an image: Content-Type is ${contentType || 'not specified'}`;
      }
      
      setTestResults(prev => 
        prev.map((result, i) => 
          i === index 
            ? { 
                ...result, 
                status: isValidImage ? 'success' : 'error',
                error: errorMessage,
                retryCount
              }
            : result
        )
      );
      
      // If the request failed and we haven't reached max retries, try again
      if (!isValidImage && retryCount < MAX_RETRIES) {
        console.log(`Retrying ${url}, attempt ${retryCount + 2}`);
        setTestResults(prev => 
          prev.map((result, i) => 
            i === index 
              ? { 
                  ...result, 
                  status: 'loading',
                  error: `Retrying (${retryCount + 2}/${MAX_RETRIES + 1})...`
                }
              : result
          )
        );
        
        // Exponential backoff for retries (wait longer between each retry)
        const backoffTime = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        
        return testImageUrl(url, index, retryCount + 1);
      }
      
      return isValidImage;
    } catch (error) {
      console.error(`Error testing URL ${url}:`, error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error';
      
      const isTimeoutError = errorMessage.includes('timeout') || 
                             errorMessage.includes('aborted');
      
      const isNetworkError = errorMessage.includes('network') ||
                           errorMessage.includes('CORS') ||
                           errorMessage.includes('cross-origin');
      
      let friendlyError = isTimeoutError 
        ? `Request timed out after ${TIMEOUT_MS/1000}s. The server took too long to respond.`
        : isNetworkError
          ? `Network error: ${errorMessage}. This could be due to CORS restrictions.`
          : errorMessage;
      
      setTestResults(prev => 
        prev.map((result, i) => 
          i === index 
            ? { 
                ...result, 
                status: 'error',
                error: friendlyError,
                retryCount
              }
            : result
        )
      );
      
      // If we haven't reached max retries, try again for network errors or timeouts
      if ((isTimeoutError || isNetworkError) && retryCount < MAX_RETRIES) {
        console.log(`Retrying ${url} after error, attempt ${retryCount + 2}`);
        setTestResults(prev => 
          prev.map((result, i) => 
            i === index 
              ? { 
                  ...result, 
                  status: 'loading',
                  error: `Retrying (${retryCount + 2}/${MAX_RETRIES + 1})...`
                }
              : result
          )
        );
        
        // Exponential backoff for retries
        const backoffTime = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        
        return testImageUrl(url, index, retryCount + 1);
      }
      
      return false;
    }
  };

  const initializeTestResults = (urls: string[]) => {
    // Filter out duplicate URLs before initializing
    const uniqueUrls = [...new Set(urls)];
    
    setTestResults(uniqueUrls.map(url => ({
      url,
      status: 'loading',
      retryCount: 0
    })));
    
    return uniqueUrls;
  };

  return {
    testResults,
    testImageUrl,
    initializeTestResults,
    setTestResults
  };
};
