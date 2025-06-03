
import { uploadMultipleImagesFromUrls } from '../imageUrlUtils';
import { uploadImageFromUrl } from '../imageUrlUtils';

// Mock dependencies
jest.mock('../imageUrlUtils', () => {
  const originalModule = jest.requireActual('../imageUrlUtils');
  return {
    ...originalModule,
    uploadImageFromUrl: jest.fn()
  };
});

describe('uploadMultipleImagesFromUrls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload multiple images successfully', async () => {
    // Arrange
    const imageUrls = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'];
    
    (uploadImageFromUrl as jest.Mock)
      .mockResolvedValueOnce('https://uploaded-url.com/image1.jpg')
      .mockResolvedValueOnce('https://uploaded-url.com/image2.jpg');

    // Act
    const result = await uploadMultipleImagesFromUrls(imageUrls);

    // Assert
    expect(uploadImageFromUrl).toHaveBeenCalledTimes(2);
    expect(uploadImageFromUrl).toHaveBeenCalledWith(imageUrls[0]);
    expect(uploadImageFromUrl).toHaveBeenCalledWith(imageUrls[1]);
    expect(result).toEqual([
      'https://uploaded-url.com/image1.jpg',
      'https://uploaded-url.com/image2.jpg'
    ]);
  });

  it('should filter out failed uploads', async () => {
    // Arrange
    const imageUrls = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'];
    
    (uploadImageFromUrl as jest.Mock)
      .mockResolvedValueOnce('https://uploaded-url.com/image1.jpg')
      .mockResolvedValueOnce(null);

    // Act
    const result = await uploadMultipleImagesFromUrls(imageUrls);

    // Assert
    expect(uploadImageFromUrl).toHaveBeenCalledTimes(2);
    expect(result).toEqual(['https://uploaded-url.com/image1.jpg']);
  });
});
