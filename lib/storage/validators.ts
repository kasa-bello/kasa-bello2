
import { MAX_FILE_SIZE } from './helperUtils';

/**
 * Validates if a file is an image and within size limits
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check if this is a folder or a valid image file
  if (!file.type.startsWith('image/')) {
    return { 
      valid: false, 
      error: `Invalid file type: ${file.type}. Only image files are supported.` 
    };
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large: ${file.size} bytes. Maximum allowed size is ${MAX_FILE_SIZE} bytes.` 
    };
  }
  
  return { valid: true };
};

/**
 * Logs detailed information about an image file (for debugging)
 */
export const logImageDetails = (file: File, filePath?: string): void => {
  console.log(`[DEBUG] File details: Size=${file.size}B, Type=${file.type}, Name=${file.name}`);
  if (filePath) {
    console.log(`[DEBUG] Generated path: ${filePath}`);
  }
};
