
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BUCKET_NAME } from "./helperUtils";

export const createProductImagesBucket = async () => {
  try {
    // First check if the bucket already exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Error checking buckets:", bucketsError);
      toast.error("Error checking Supabase storage", {
        description: bucketsError.message
      });
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
    
    if (bucketExists) {
      console.log(`Bucket '${BUCKET_NAME}' already exists`);
      toast.info("Storage bucket exists", {
        description: `The '${BUCKET_NAME}' bucket is already configured`
      });
      return true;
    }
    
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true
    });
    
    if (error) {
      console.error("Error creating bucket:", error);
      toast.error("Error creating storage bucket", {
        description: error.message
      });
      return false;
    }
    
    console.log(`Successfully created bucket: ${BUCKET_NAME}`);
    toast.success("Storage bucket created", {
      description: `The '${BUCKET_NAME}' bucket has been created successfully`
    });
    
    return true;
  } catch (error) {
    console.error("Error in createProductImagesBucket:", error);
    toast.error("Unexpected error", {
      description: error instanceof Error ? error.message : "Unknown error creating bucket"
    });
    return false;
  }
};
