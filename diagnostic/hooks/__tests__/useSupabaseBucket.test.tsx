
import { renderHook, act } from '@testing-library/react-hooks';
import { useSupabaseBucket } from '../useSupabaseBucket';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createProductImagesBucket } from '@/lib/storage/createBucket';

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      listBuckets: jest.fn(),
      from: jest.fn()
    }
  }
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn()
  }
}));

jest.mock('@/lib/storage/createBucket', () => ({
  createProductImagesBucket: jest.fn()
}));

describe('useSupabaseBucket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    // Act
    const { result } = renderHook(() => useSupabaseBucket());

    // Assert
    expect(result.current.isCreatingBucket).toBe(false);
    expect(result.current.supabaseStatus).toBe('idle');
    expect(result.current.bucketInfo).toBe(null);
  });

  it('should handle creating a bucket successfully', async () => {
    // Arrange
    (createProductImagesBucket as jest.Mock).mockResolvedValue(true);

    // Act
    const { result } = renderHook(() => useSupabaseBucket());
    let successResult;
    
    await act(async () => {
      successResult = await result.current.handleCreateBucket();
    });

    // Assert
    expect(createProductImagesBucket).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Bucket created successfully');
    expect(successResult).toBe(true);
    expect(result.current.isCreatingBucket).toBe(false);
  });

  it('should handle bucket creation failure', async () => {
    // Arrange
    (createProductImagesBucket as jest.Mock).mockResolvedValue(false);

    // Act
    const { result } = renderHook(() => useSupabaseBucket());
    let failureResult;
    
    await act(async () => {
      failureResult = await result.current.handleCreateBucket();
    });

    // Assert
    expect(createProductImagesBucket).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Failed to create bucket');
    expect(failureResult).toBe(false);
    expect(result.current.isCreatingBucket).toBe(false);
  });

  it('should handle exceptions during bucket creation', async () => {
    // Arrange
    const error = new Error('Creation failed');
    (createProductImagesBucket as jest.Mock).mockRejectedValue(error);

    // Act
    const { result } = renderHook(() => useSupabaseBucket());
    let failureResult;
    
    await act(async () => {
      failureResult = await result.current.handleCreateBucket();
    });

    // Assert
    expect(createProductImagesBucket).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
    expect(failureResult).toBe(false);
    expect(result.current.isCreatingBucket).toBe(false);
  });

  it('should check bucket status successfully', async () => {
    // Arrange
    const mockBuckets = [{ name: 'product-images' }];
    const mockFiles = [{ name: 'test.jpg' }];
    
    const mockListBuckets = jest.fn().mockResolvedValue({
      data: mockBuckets,
      error: null
    });
    
    const mockList = jest.fn().mockResolvedValue({
      data: mockFiles,
      error: null
    });
    
    (supabase.storage.listBuckets as jest.Mock).mockReturnValue(mockListBuckets());
    (supabase.storage.from as jest.Mock).mockReturnValue({
      list: mockList
    });

    // Act
    const { result } = renderHook(() => useSupabaseBucket());
    let statusResult;
    
    await act(async () => {
      statusResult = await result.current.checkBucketStatus();
    });

    // Assert
    expect(supabase.storage.listBuckets).toHaveBeenCalled();
    expect(supabase.storage.from).toHaveBeenCalledWith('product-images');
    expect(result.current.supabaseStatus).toBe('success');
    expect(result.current.bucketInfo).toMatchObject({
      buckets: ['product-images'],
      hasProductImagesBucket: true,
      fileCount: 1
    });
    expect(statusResult).toBe(true);
  });

  it('should handle missing product-images bucket', async () => {
    // Arrange
    const mockBuckets = [{ name: 'other-bucket' }];
    
    const mockListBuckets = jest.fn().mockResolvedValue({
      data: mockBuckets,
      error: null
    });
    
    (supabase.storage.listBuckets as jest.Mock).mockReturnValue(mockListBuckets());

    // Act
    const { result } = renderHook(() => useSupabaseBucket());
    let statusResult;
    
    await act(async () => {
      statusResult = await result.current.checkBucketStatus();
    });

    // Assert
    expect(supabase.storage.listBuckets).toHaveBeenCalled();
    expect(result.current.supabaseStatus).toBe('error');
    expect(result.current.bucketInfo).toMatchObject({
      buckets: ['other-bucket'],
      hasProductImagesBucket: false
    });
    expect(toast.warning).toHaveBeenCalled();
    expect(statusResult).toBe(false);
  });
});
