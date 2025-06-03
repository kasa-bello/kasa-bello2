
import { renderHook, act } from '@testing-library/react-hooks';
import { useImageDiagnostic } from '../useImageDiagnostic';
import { useSupabaseBucket } from '../hooks/useSupabaseBucket';
import { useImageTesting } from '../hooks/useImageTesting';
import { toast } from 'sonner';

// Mock the hooks that useImageDiagnostic depends on
jest.mock('../hooks/useSupabaseBucket', () => ({
  useSupabaseBucket: jest.fn()
}));

jest.mock('../hooks/useImageTesting', () => ({
  useImageTesting: jest.fn()
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn()
  }
}));

describe('useImageDiagnostic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up mock implementations
    (useSupabaseBucket as jest.Mock).mockReturnValue({
      isCreatingBucket: false,
      supabaseStatus: 'idle',
      bucketInfo: null,
      handleCreateBucket: jest.fn(),
      checkBucketStatus: jest.fn().mockResolvedValue(true)
    });
    
    (useImageTesting as jest.Mock).mockReturnValue({
      isCheckingImages: false,
      testResults: [],
      testProductImages: jest.fn().mockResolvedValue(true)
    });
  });

  it('should return the combined properties from both hooks', () => {
    // Act
    const { result } = renderHook(() => useImageDiagnostic());

    // Assert
    expect(result.current).toHaveProperty('isCheckingImages');
    expect(result.current).toHaveProperty('isCreatingBucket');
    expect(result.current).toHaveProperty('testResults');
    expect(result.current).toHaveProperty('supabaseStatus');
    expect(result.current).toHaveProperty('bucketInfo');
    expect(result.current).toHaveProperty('handleCreateBucket');
    expect(result.current).toHaveProperty('checkProductImages');
  });

  it('should check bucket status and test product images', async () => {
    // Arrange
    const mockCheckBucketStatus = jest.fn().mockResolvedValue(true);
    const mockTestProductImages = jest.fn().mockResolvedValue(true);
    
    (useSupabaseBucket as jest.Mock).mockReturnValue({
      checkBucketStatus: mockCheckBucketStatus
    });
    
    (useImageTesting as jest.Mock).mockReturnValue({
      testProductImages: mockTestProductImages
    });

    // Act
    const { result } = renderHook(() => useImageDiagnostic());
    
    await act(async () => {
      await result.current.checkProductImages();
    });

    // Assert
    expect(mockCheckBucketStatus).toHaveBeenCalled();
    expect(mockTestProductImages).toHaveBeenCalled();
  });

  it('should not test product images if bucket check fails', async () => {
    // Arrange
    const mockCheckBucketStatus = jest.fn().mockResolvedValue(false);
    const mockTestProductImages = jest.fn();
    
    (useSupabaseBucket as jest.Mock).mockReturnValue({
      checkBucketStatus: mockCheckBucketStatus
    });
    
    (useImageTesting as jest.Mock).mockReturnValue({
      testProductImages: mockTestProductImages
    });

    // Act
    const { result } = renderHook(() => useImageDiagnostic());
    
    await act(async () => {
      await result.current.checkProductImages();
    });

    // Assert
    expect(mockCheckBucketStatus).toHaveBeenCalled();
    expect(mockTestProductImages).not.toHaveBeenCalled();
  });

  it('should handle errors during the diagnostic process', async () => {
    // Arrange
    const error = new Error('Test error');
    const mockCheckBucketStatus = jest.fn().mockRejectedValue(error);
    
    (useSupabaseBucket as jest.Mock).mockReturnValue({
      checkBucketStatus: mockCheckBucketStatus
    });

    // Act
    const { result } = renderHook(() => useImageDiagnostic());
    
    await act(async () => {
      await result.current.checkProductImages();
    });

    // Assert
    expect(mockCheckBucketStatus).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Diagnostic error', {
      description: error.message
    });
  });
});
