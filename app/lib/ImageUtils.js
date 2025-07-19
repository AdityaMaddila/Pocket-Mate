// lib/imageUtils.js
import imageCompression from 'browser-image-compression';

export const compressImage = async (file) => {
  try {
    // Compression options
    const options = {
      maxSizeMB: 0.8, // Maximum file size in MB (staying under 1MB limit)
      maxWidthOrHeight: 1920, // Maximum width or height in pixels
      useWebWorker: true, // Use web worker for better performance
      fileType: 'image/jpeg', // Convert to JPEG for better compression
      initialQuality: 0.8, // Initial quality (0.1 to 1)
    };
    
    console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    
    const compressedFile = await imageCompression(file, options);
    
    console.log('Compressed file size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
    
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image. Please try again.');
  }
};

export const validateImageFile = (file) => {
  // Check if it's an image file
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (JPEG, PNG, etc.)');
  }
  
  // Check file size (10MB max before compression)
  const maxSizeBeforeCompression = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeBeforeCompression) {
    throw new Error('Image file is too large. Please select a file smaller than 10MB.');
  }
  
  return true;
};