
import { uploadImageToSupabase } from '../imageUploadUtils';
import { validateImageFile } from '../validators';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('../validators', () => ({
  validateImageFile: jest.fn(),
  logImageDetails: jest.fn()
}));

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
    error: jest.fn()
  }
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid')
}));

describe('uploadImageToSupabase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload an image successfully', async () => {
    // Arrange
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const bucketName = 'product-images';
    
    // Mock validation to return valid
    (validateImageFile as jest.Mock).mockReturnValue({ valid: true });
    
    // Mock Supabase storage methods
    const mockListBuckets = jest.fn().mockResolvedValue({
      data: [{ name: bucketName }],
      error: null
    });
    
    const mockUpload = jest.fn().mockResolvedValue({
      data: { path: 'mocked-uuid.jpg' },
      error: null
    });
    
    const mockGetPublicUrl = jest.fn().mockReturnValue({
      data: { publicUrl: 'https://example.com/mocked-uuid.jpg' }
    });
    
    (supabase.storage.listBuckets as jest.Mock).mockReturnValue(mockListBuckets());
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl
    });

    // Act
    const result = await uploadImageToSupabase(mockFile);

    // Assert
    expect(validateImageFile).toHaveBeenCalledWith(mockFile);
    expect(supabase.storage.listBuckets).toHaveBeenCalled();
    expect(supabase.storage.from).toHaveBeenCalledWith(bucketName);
    expect(mockUpload).toHaveBeenCalled();
    expect(mockGetPublicUrl).toHaveBeenCalledWith('mocked-uuid.jpg');
    expect(result).toBe('https://example.com/mocked-uuid.jpg');
  });

  it('should return null if validation fails', async () => {
    // Arrange
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    
    // Mock validation to return invalid
    (validateImageFile as jest.Mock).mockReturnValue({ 
      valid: false, 
      error: 'Invalid file type' 
    });

    // Act
    const result = await uploadImageToSupabase(mockFile);

    // Assert
    expect(validateImageFile).toHaveBeenCalledWith(mockFile);
    expect(result).toBeNull();
  });

  it('should return null if bucket does not exist', async () => {
    // Arrange
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    // Mock validation to return valid
    (validateImageFile as jest.Mock).mockReturnValue({ valid: true });
    
    // Mock Supabase storage methods
    const mockListBuckets = jest.fn().mockResolvedValue({
      data: [{ name: 'other-bucket' }],
      error: null
    });
    
    (supabase.storage.listBuckets as jest.Mock).mockReturnValue(mockListBuckets());

    // Act
    const result = await uploadImageToSupabase(mockFile);

    // Assert
    expect(validateImageFile).toHaveBeenCalledWith(mockFile);
    expect(supabase.storage.listBuckets).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should return null if upload fails', async () => {
    // Arrange
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const bucketName = 'product-images';
    
    // Mock validation to return valid
    (validateImageFile as jest.Mock).mockReturnValue({ valid: true });
    
    // Mock Supabase storage methods
    const mockListBuckets = jest.fn().mockResolvedValue({
      data: [{ name: bucketName }],
      error: null
    });
    
    const mockUpload = jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'Upload failed' }
    });
    
    (supabase.storage.listBuckets as jest.Mock).mockReturnValue(mockListBuckets());
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: mockUpload
    });

    // Act
    const result = await uploadImageToSupabase(mockFile);

    // Assert
    expect(validateImageFile).toHaveBeenCalledWith(mockFile);
    expect(supabase.storage.listBuckets).toHaveBeenCalled();
    expect(supabase.storage.from).toHaveBeenCalledWith(bucketName);
    expect(mockUpload).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
