
import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useImageTesting } from '../useImageTesting';
import { useImageUrlTester } from '../useImageUrlTester';
import { useProductImageFetcher } from '../useProductImageFetcher';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn()
  }
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn()
  }
}));

// Mock the custom hooks
jest.mock('../useImageUrlTester', () => ({
  useImageUrlTester: jest.fn()
}));

jest.mock('../useProductImageFetcher', () => ({
  useProductImageFetcher: jest.fn()
}));

// Mock global fetch
global.fetch = jest.fn();

describe('useImageTesting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up default mock implementations
    (useImageUrlTester as jest.Mock).mockReturnValue({
      testResults: [],
      testImageUrl: jest.fn().mockResolvedValue(true),
      initializeTestResults: jest.fn()
    });
    
    (useProductImageFetcher as jest.Mock).mockReturnValue({
      isLoading: false,
      fetchProductImages: jest.fn().mockResolvedValue(['https://example.com/image1.jpg'])
    });
  });

  it('should initialize with default values', () => {
    // Act
    const { result } = renderHook(() => useImageTesting());

    // Assert
    expect(result.current.isCheckingImages).toBe(false);
    expect(result.current.testResults).toEqual([]);
  });

  it('should test product images successfully', async () => {
    // Arrange
    const mockTestImageUrl = jest.fn().mockResolvedValue(true);
    const mockInitializeTestResults = jest.fn();
    const mockFetchProductImages = jest.fn().mockResolvedValue(['https://example.com/image1.jpg']);
    
    (useImageUrlTester as jest.Mock).mockReturnValue({
      testResults: [{ url: 'https://example.com/image1.jpg', status: 'success' }],
      testImageUrl: mockTestImageUrl,
      initializeTestResults: mockInitializeTestResults
    });
    
    (useProductImageFetcher as jest.Mock).mockReturnValue({
      isLoading: false,
      fetchProductImages: mockFetchProductImages
    });
    
    // Act
    const { result } = renderHook(() => useImageTesting());
    
    let success;
    await act(async () => {
      success = await result.current.testProductImages();
    });

    // Assert
    expect(mockFetchProductImages).toHaveBeenCalled();
    expect(mockInitializeTestResults).toHaveBeenCalledWith(['https://example.com/image1.jpg']);
    expect(mockTestImageUrl).toHaveBeenCalledWith('https://example.com/image1.jpg', 0);
    expect(success).toBe(true);
    expect(toast.success).toHaveBeenCalled();
  });

  it('should handle partial success for image tests', async () => {
    // Arrange
    const mockTestImageUrl = jest.fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
      
    const mockFetchProductImages = jest.fn().mockResolvedValue([
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg'
    ]);
    
    (useImageUrlTester as jest.Mock).mockReturnValue({
      testResults: [
        { url: 'https://example.com/image1.jpg', status: 'success' },
        { url: 'https://example.com/image2.jpg', status: 'error', error: 'HTTP 404: Not Found' }
      ],
      testImageUrl: mockTestImageUrl,
      initializeTestResults: jest.fn()
    });
    
    (useProductImageFetcher as jest.Mock).mockReturnValue({
      isLoading: false,
      fetchProductImages: mockFetchProductImages
    });
    
    // Act
    const { result } = renderHook(() => useImageTesting());
    
    let success;
    await act(async () => {
      success = await result.current.testProductImages();
    });

    // Assert
    expect(mockFetchProductImages).toHaveBeenCalled();
    expect(mockTestImageUrl).toHaveBeenCalledTimes(2);
    expect(success).toBe(true);
    expect(toast.warning).toHaveBeenCalled();
  });

  it('should handle no product images found', async () => {
    // Arrange
    const mockFetchProductImages = jest.fn().mockResolvedValue([]);
    
    (useProductImageFetcher as jest.Mock).mockReturnValue({
      isLoading: false,
      fetchProductImages: mockFetchProductImages
    });
    
    // Act
    const { result } = renderHook(() => useImageTesting());
    
    let success;
    await act(async () => {
      success = await result.current.testProductImages();
    });

    // Assert
    expect(mockFetchProductImages).toHaveBeenCalled();
    expect(success).toBe(false);
    expect(toast.warning).toHaveBeenCalled();
  });

  it('should handle errors during image testing', async () => {
    // Arrange
    const mockError = new Error('Test error');
    const mockFetchProductImages = jest.fn().mockRejectedValue(mockError);
    
    (useProductImageFetcher as jest.Mock).mockReturnValue({
      isLoading: false,
      fetchProductImages: mockFetchProductImages
    });
    
    // Act
    const { result } = renderHook(() => useImageTesting());
    
    let success;
    await act(async () => {
      success = await result.current.testProductImages();
    });

    // Assert
    expect(mockFetchProductImages).toHaveBeenCalled();
    expect(success).toBe(false);
    expect(toast.error).toHaveBeenCalled();
  });
});
