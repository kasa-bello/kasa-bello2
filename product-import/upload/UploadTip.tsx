
export const UploadTip = () => {
  return (
    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded text-blue-800 dark:text-blue-300">
      <h3 className="font-medium mb-2">Tip:</h3>
      <p className="text-sm">
        After uploading, you can copy the image URLs and include them in your product data. For multiple images, 
        separate URLs with commas in your CSV file's images column. You can upload an entire folder of product images at once.
      </p>
    </div>
  );
};
