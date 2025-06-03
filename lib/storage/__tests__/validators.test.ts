
import { validateImageFile, logImageDetails } from '../validators';
import { MAX_FILE_SIZE } from '../helperUtils';

describe('validateImageFile', () => {
  it('should validate a correct image file', () => {
    // Arrange
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(mockFile, 'size', { value: 1000 });

    // Act
    const result = validateImageFile(mockFile);

    // Assert
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject a non-image file', () => {
    // Arrange
    const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });

    // Act
    const result = validateImageFile(mockFile);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file type');
  });

  it('should reject a file larger than MAX_FILE_SIZE', () => {
    // Arrange
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(mockFile, 'size', { value: MAX_FILE_SIZE + 1 });

    // Act
    const result = validateImageFile(mockFile);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.error).toContain('File too large');
  });
});

describe('logImageDetails', () => {
  it('should log image details to console', () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(mockFile, 'size', { value: 1000 });
    const mockPath = 'images/test.jpg';

    // Act
    logImageDetails(mockFile, mockPath);

    // Assert
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('File details'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Generated path'));

    // Cleanup
    consoleSpy.mockRestore();
  });

  it('should log only file details when path is not provided', () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(mockFile, 'size', { value: 1000 });

    // Act
    logImageDetails(mockFile);

    // Assert
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('File details'));

    // Cleanup
    consoleSpy.mockRestore();
  });
});
