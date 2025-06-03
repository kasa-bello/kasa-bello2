
import { getDirectDownloadUrl, getStorageInfo, BUCKET_NAME } from '../helperUtils';
import { supabase } from '@/integrations/supabase/client';

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      listBuckets: jest.fn(),
      from: jest.fn()
    }
  }
}));

describe('getDirectDownloadUrl', () => {
  it('should convert Dropbox URL with dl=0 to dl=1', () => {
    // Arrange
    const input = 'https://www.dropbox.com/s/abcdef/image.jpg?dl=0';
    
    // Act
    const result = getDirectDownloadUrl(input);
    
    // Assert
    expect(result).toBe('https://www.dropbox.com/s/abcdef/image.jpg?dl=1');
  });

  it('should add dl=1 parameter to Dropbox URL without dl parameter', () => {
    // Arrange
    const input = 'https://www.dropbox.com/s/abcdef/image.jpg';
    
    // Act
    const result = getDirectDownloadUrl(input);
    
    // Assert
    expect(result).toBe('https://www.dropbox.com/s/abcdef/image.jpg?dl=1');
  });

  it('should add dl=1 parameter to Dropbox URL with other parameters', () => {
    // Arrange
    const input = 'https://www.dropbox.com/s/abcdef/image.jpg?raw=1';
    
    // Act
    const result = getDirectDownloadUrl(input);
    
    // Assert
    expect(result).toBe('https://www.dropbox.com/s/abcdef/image.jpg?raw=1&dl=1');
  });

  it('should not modify non-Dropbox URLs', () => {
    // Arrange
    const input = 'https://example.com/image.jpg';
    
    // Act
    const result = getDirectDownloadUrl(input);
    
    // Assert
    expect(result).toBe(input);
  });
});

describe('getStorageInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return bucket and files info when bucket exists and files can be listed', async () => {
    // Arrange
    const mockBucket = { id: BUCKET_NAME, name: BUCKET_NAME, public: true };
    const mockFiles = [{ name: 'image1.jpg' }, { name: 'image2.jpg' }];
    
    const mockListBuckets = jest.fn().mockResolvedValue({
      data: [mockBucket],
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
    const result = await getStorageInfo();

    // Assert
    expect(supabase.storage.listBuckets).toHaveBeenCalled();
    expect(supabase.storage.from).toHaveBeenCalledWith(BUCKET_NAME);
    expect(result).toEqual({
      success: true,
      bucket: mockBucket,
      files: mockFiles
    });
  });

  it('should return error when bucket does not exist', async () => {
    // Arrange
    const mockListBuckets = jest.fn().mockResolvedValue({
      data: [{ name: 'other-bucket' }],
      error: null
    });
    
    (supabase.storage.listBuckets as jest.Mock).mockReturnValue(mockListBuckets());

    // Act
    const result = await getStorageInfo();

    // Assert
    expect(supabase.storage.listBuckets).toHaveBeenCalled();
    expect(result).toEqual({
      error: `Bucket '${BUCKET_NAME}' not found`,
      buckets: ['other-bucket']
    });
  });

  it('should return error when listing buckets fails', async () => {
    // Arrange
    const mockError = { message: 'Failed to list buckets' };
    const mockListBuckets = jest.fn().mockResolvedValue({
      data: null,
      error: mockError
    });
    
    (supabase.storage.listBuckets as jest.Mock).mockReturnValue(mockListBuckets());

    // Act
    const result = await getStorageInfo();

    // Assert
    expect(supabase.storage.listBuckets).toHaveBeenCalled();
    expect(result).toEqual({
      error: mockError.message,
      details: mockError
    });
  });

  it('should return error when listing files fails', async () => {
    // Arrange
    const mockBucket = { id: BUCKET_NAME, name: BUCKET_NAME, public: true };
    const mockError = { message: 'Failed to list files' };
    
    const mockListBuckets = jest.fn().mockResolvedValue({
      data: [mockBucket],
      error: null
    });
    
    const mockList = jest.fn().mockResolvedValue({
      data: null,
      error: mockError
    });
    
    (supabase.storage.listBuckets as jest.Mock).mockReturnValue(mockListBuckets());
    (supabase.storage.from as jest.Mock).mockReturnValue({
      list: mockList
    });

    // Act
    const result = await getStorageInfo();

    // Assert
    expect(supabase.storage.listBuckets).toHaveBeenCalled();
    expect(supabase.storage.from).toHaveBeenCalledWith(BUCKET_NAME);
    expect(result).toEqual({
      error: `Cannot list files in bucket: ${mockError.message}`,
      bucket: mockBucket,
      details: mockError
    });
  });
});
