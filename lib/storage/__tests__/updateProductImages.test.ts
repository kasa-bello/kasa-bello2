
import { updateProductImages } from '../imageUrlUtils';
import { uploadMultipleImagesFromUrls } from '../imageUrlUtils';
import { supabase } from '@/integrations/supabase/client';

// Mock dependencies
jest.mock('../imageUrlUtils', () => {
  const originalModule = jest.requireActual('../imageUrlUtils');
  return {
    ...originalModule,
    uploadMultipleImagesFromUrls: jest.fn()
  };
});

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn()
  }
}));

describe('updateProductImages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update product images successfully', async () => {
    // Arrange
    const sku = 'TEST123';
    const imageUrls = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'];
    const uploadedUrls = ['https://uploaded-url.com/image1.jpg', 'https://uploaded-url.com/image2.jpg'];
    
    (uploadMultipleImagesFromUrls as jest.Mock).mockResolvedValue(uploadedUrls);
    
    const mockUpdate = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ error: null })
    });
    
    (supabase.from as jest.Mock).mockReturnValue({
      update: mockUpdate
    });

    // Act
    const result = await updateProductImages(sku, imageUrls);

    // Assert
    expect(uploadMultipleImagesFromUrls).toHaveBeenCalledWith(imageUrls);
    expect(supabase.from).toHaveBeenCalledWith('Products');
    expect(mockUpdate).toHaveBeenCalledWith({
      "Images": JSON.stringify(uploadedUrls),
      "Image URL": uploadedUrls[0]
    });
    expect(result).toBe(true);
  });

  it('should return false if no images were uploaded', async () => {
    // Arrange
    const sku = 'TEST123';
    const imageUrls = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'];
    
    (uploadMultipleImagesFromUrls as jest.Mock).mockResolvedValue([]);

    // Act
    const result = await updateProductImages(sku, imageUrls);

    // Assert
    expect(uploadMultipleImagesFromUrls).toHaveBeenCalledWith(imageUrls);
    expect(supabase.from).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should return false if update fails', async () => {
    // Arrange
    const sku = 'TEST123';
    const imageUrls = ['https://example.com/image1.jpg'];
    const uploadedUrls = ['https://uploaded-url.com/image1.jpg'];
    
    (uploadMultipleImagesFromUrls as jest.Mock).mockResolvedValue(uploadedUrls);
    
    const mockUpdate = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ error: { message: 'Update failed' } })
    });
    
    (supabase.from as jest.Mock).mockReturnValue({
      update: mockUpdate
    });

    // Act
    const result = await updateProductImages(sku, imageUrls);

    // Assert
    expect(uploadMultipleImagesFromUrls).toHaveBeenCalledWith(imageUrls);
    expect(supabase.from).toHaveBeenCalledWith('Products');
    expect(result).toBe(false);
  });
});
