
export const ImageGalleryLoading = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px] flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-16 w-16 mb-4 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};
