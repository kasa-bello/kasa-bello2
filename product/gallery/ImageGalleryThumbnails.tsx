
interface ImageGalleryThumbnailsProps {
  filteredImages: string[];
  loadErrors: {[key: number]: boolean};
  currentImage: number;
  setCurrentImage: (index: number) => void;
  handleImageError: (index: number) => void;
}

export const ImageGalleryThumbnails = ({
  filteredImages,
  loadErrors,
  currentImage,
  setCurrentImage,
  handleImageError
}: ImageGalleryThumbnailsProps) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      {filteredImages.map((img, index) => {
        if (loadErrors[index]) return null;
        
        return (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`relative w-20 h-20 rounded-md border-2 overflow-hidden flex-shrink-0 ${
              currentImage === index 
                ? 'border-primary' 
                : 'border-gray-200 dark:border-gray-800'
            }`}
          >
            <img 
              src={img} 
              alt={`Product thumbnail ${index+1}`} 
              className="w-full h-full object-cover"
              onError={() => handleImageError(index)}
            />
            {currentImage === index && (
              <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
            )}
          </button>
        );
      })}
    </div>
  );
};
