
import { uploadImageFromUrl } from '../imageUrlUtils';
import { uploadImageToSupabase } from '../imageUploadUtils';

// Mock dependencies
jest.mock('../imageUploadUtils', () => ({
  uploadImageToSupabase: jest.fn()
}));

// Mock global fetch
global.fetch = jest.fn();

describe('uploadImageFromUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload an image from a URL successfully', async () => {
    // Arrange
    const imageUrl = 'https://example.com/image.jpg';
    const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
    const mockResponse = { ok: true, blob: jest.fn().mockResolvedValue(mockBlob) };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    (uploadImageToSupabase as jest.Mock).mockResolvedValue('https://uploaded-url.com/image.jpg');

    // Act
    const result = await uploadImageFromUrl(imageUrl);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(imageUrl);
    expect(mockResponse.blob).toHaveBeenCalled();
    expect(uploadImageToSupabase).toHaveBeenCalled();
    expect(result).toBe('https://uploaded-url.com/image.jpg');
  });

  it('should convert local paths to full URLs', async () => {
    // Arrange
    const localPath = '/image.jpg';
    const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
    const mockResponse = { ok: true, blob: jest.fn().mockResolvedValue(mockBlob) };
    
    // Mock window.location.origin
    Object.defineProperty(window, 'location', {
      value: { origin: 'https://example.com' }
    });
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    (uploadImageToSupabase as jest.Mock).mockResolvedValue('https://uploaded-url.com/image.jpg');

    // Act
    const result = await uploadImageFromUrl(localPath);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/image.jpg');
    expect(result).toBe('https://uploaded-url.com/image.jpg');
  });

  it('should return null if fetch fails', async () => {
    // Arrange
    const imageUrl = 'https://example.com/image.jpg';
    
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    // Act
    const result = await uploadImageFromUrl(imageUrl);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(imageUrl);
    expect(result).toBeNull();
  });

  it('should return null if response is not ok', async () => {
    // Arrange
    const imageUrl = 'https://example.com/image.jpg';
    const mockResponse = { ok: false, statusText: 'Not Found' };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Act
    const result = await uploadImageFromUrl(imageUrl);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(imageUrl);
    expect(result).toBeNull();
  });
});
