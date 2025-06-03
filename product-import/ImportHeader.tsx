
export const ImportHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Product Import</h1>
      <p className="text-gray-600 dark:text-gray-300 max-w-2xl mb-4">
        Import your products from a CSV file and upload images from your computer or Dropbox to quickly populate your store.
      </p>
      
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-md text-green-800 dark:text-green-300 mb-6">
        <p className="text-sm font-medium">
          You are currently at: <span className="font-bold">/admin/import</span>
        </p>
        <p className="text-sm mt-1">
          You can bookmark this page or access it directly by typing <code>/admin/import</code> in your browser's address bar.
        </p>
      </div>
    </div>
  );
};
