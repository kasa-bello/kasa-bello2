
import { supabase } from "@/integrations/supabase/client";
import { BUCKET_NAME } from './helperUtils';

/**
 * Delete all images from the product-images bucket
 */
export const deleteAllStorageImages = async (): Promise<{
  success: boolean;
  deletedCount: number;
  error?: string;
}> => {
  try {
    console.log("Starting to delete all images from storage bucket:", BUCKET_NAME);
    
    // First, list all files in the bucket
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list();
    
    if (listError) {
      console.error("Error listing files:", listError);
      return { success: false, deletedCount: 0, error: listError.message };
    }
    
    if (!files || files.length === 0) {
      console.log("No files found in the bucket");
      return { success: true, deletedCount: 0 };
    }
    
    console.log(`Found ${files.length} files to delete`);
    
    // Delete each file individually
    let deletedCount = 0;
    const errors: string[] = [];
    
    for (const file of files) {
      try {
        const { error: deleteError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([file.name]);
        
        if (deleteError) {
          console.error(`Error deleting file ${file.name}:`, deleteError);
          errors.push(`${file.name}: ${deleteError.message}`);
        } else {
          deletedCount++;
          console.log(`Successfully deleted file: ${file.name}`);
        }
      } catch (err) {
        console.error(`Unexpected error deleting file ${file.name}:`, err);
        errors.push(`${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
    
    console.log(`Deleted ${deletedCount} out of ${files.length} files`);
    
    if (errors.length > 0) {
      console.warn(`There were ${errors.length} errors during deletion`);
      return { 
        success: deletedCount > 0, 
        deletedCount, 
        error: `Failed to delete all files. ${errors.length} errors occurred.` 
      };
    }
    
    return { success: true, deletedCount };
  } catch (error) {
    console.error("Error in deleteAllStorageImages:", error);
    return { 
      success: false, 
      deletedCount: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
