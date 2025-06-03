
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MAX_FILE_SIZE, BUCKET_NAME } from './helperUtils';
import { validateImageFile, logImageDetails } from './validators';

/**
 * Upload an image file to Supabase Storage
 */
export const uploadImageToSupabase = async (file: File): Promise<string | null> => {
  try {
    // Validate the file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      console.error(validation.error);
      return null;
    }
    
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Enhanced logging for debugging
    console.log(`[DEBUG] Starting upload for: ${file.name}`);
    logImageDetails(file, filePath);
    
    // Check if the bucket exists before trying to upload
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error("[DEBUG] Error checking buckets:", bucketError);
      return null;
    }
    
    console.log("[DEBUG] Available buckets:", buckets.map(b => b.name).join(', '));
    
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      console.error(`[DEBUG] Bucket '${BUCKET_NAME}' does not exist!`);
      console.error(`[DEBUG] You need to create the bucket '${BUCKET_NAME}' in Supabase.`);
      toast.error(`Storage bucket '${BUCKET_NAME}' does not exist`, {
        description: "Please create it in the Supabase dashboard or visit Admin Tools"
      });
      return null;
    }
    
    console.log(`[DEBUG] Bucket '${BUCKET_NAME}' exists, proceeding with upload`);
    
    // Create a new file with explicit type to ensure correct content-type
    const imageBlob = file.slice(0, file.size, file.type);
    const newFile = new File([imageBlob], file.name, { type: file.type });
    
    // Upload the file to Supabase Storage with enhanced error logging
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, newFile, {
        contentType: file.type, 
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error("[DEBUG] Supabase storage upload error:", error);
      console.error("[DEBUG] Error details:", JSON.stringify(error, null, 2));
      
      // Check for common error scenarios
      if (error.message.includes("permission")) {
        console.error("[DEBUG] This appears to be a permission issue. Check RLS policies for the storage bucket.");
      } else if (error.message.includes("bucket")) {
        console.error("[DEBUG] This appears to be an issue with the bucket. Make sure it exists and is accessible.");
      } else if (error.message.includes("auth")) {
        console.error("[DEBUG] This appears to be an authentication issue. Make sure you're properly authenticated.");
      }
      
      toast.error("Upload failed", {
        description: error.message
      });
      return null;
    }

    if (!data || !data.path) {
      console.error("[DEBUG] Upload succeeded but no path was returned:", data);
      return null;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    console.log("[DEBUG] Upload successful! Public URL:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("[DEBUG] Unexpected error in uploadImageToSupabase:", error);
    if (error instanceof Error) {
      toast.error("Upload error", { description: error.message });
    }
    return null;
  }
};
