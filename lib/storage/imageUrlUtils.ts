
import { uploadImageToSupabase } from './imageUploadUtils';
import { getDirectDownloadUrl } from './helperUtils';
import { supabase } from "@/integrations/supabase/client";
import { MAX_FILE_SIZE } from './helperUtils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload an image from a URL to Supabase Storage
 */
export const uploadImageFromUrl = async (imageUrl: string): Promise<string | null> => {
  try {
    // If the URL is a local path (starts with '/'), convert it to a full URL
    const fullUrl = imageUrl.startsWith('/') 
      ? `${window.location.origin}${imageUrl}`
      : imageUrl;
    
    console.log("Attempting to fetch image from:", fullUrl);
    
    // Download the image
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
    
    // Check if this is a valid image type
    if (!blob.type.startsWith('image/')) {
      console.error(`Invalid file type: ${blob.type}. Only image files are supported.`);
      return null;
    }
    
    // Check file size
    if (blob.size > MAX_FILE_SIZE) {
      console.error(`File too large: ${blob.size} bytes. Maximum allowed size is ${MAX_FILE_SIZE} bytes.`);
      return null;
    }
    
    // Extract filename from URL or generate a uuid if not available
    let filename = imageUrl.split('/').pop();
    if (!filename || !filename.includes('.')) {
      const fileExt = blob.type.split('/').pop();
      filename = `${uuidv4()}.${fileExt}`;
    }
    
    // Create a File object from the blob
    const file = new File([blob], filename, { type: blob.type });
    
    // Upload to Supabase
    return await uploadImageToSupabase(file);
  } catch (error) {
    console.error("Error in uploadImageFromUrl:", error);
    return null;
  }
};

/**
 * Upload multiple images from URLs to Supabase Storage
 */
export const uploadMultipleImagesFromUrls = async (imageUrls: string[]): Promise<string[]> => {
  const uploadPromises = imageUrls.map(url => uploadImageFromUrl(url));
  const results = await Promise.allSettled(uploadPromises);
  
  return results
    .filter((result): result is PromiseFulfilledResult<string | null> => 
      result.status === 'fulfilled' && result.value !== null)
    .map(result => result.value as string);
};

/**
 * Update product images for a specific SKU
 */
export const updateProductImages = async (sku: string, imageUrls: string[]): Promise<boolean> => {
  try {
    console.log("Starting to upload images:", imageUrls);
    
    // First, upload all the images to Supabase Storage
    const uploadedUrls = await uploadMultipleImagesFromUrls(imageUrls);
    
    console.log("Uploaded URLs:", uploadedUrls);
    
    if (uploadedUrls.length === 0) {
      throw new Error("Failed to upload any images");
    }
    
    // Create a JSON array of all image URLs
    const imagesJson = JSON.stringify(uploadedUrls);
    
    // Use a custom object for the update to avoid TypeScript errors
    const updateData: Record<string, any> = {
      "Images": imagesJson,  // Store all images as a JSON array
      "Image URL": uploadedUrls[0]  // Use the first image as the main product image
    };
    
    // Update the product record with the primary image and the JSON array of all images
    const { error } = await supabase
      .from("Products")
      .update(updateData)
      .eq("Sku", sku);
    
    if (error) {
      console.error("Error updating product images:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateProductImages:", error);
    return false;
  }
};
