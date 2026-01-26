import { Platform } from 'react-native';

const CLOUD_NAME = 'dyy0hwnns';
const UPLOAD_PRESET = 'ml_default';

export async function uploadImageToCloudinary(uri, folder = 'assets') {
  try {
    let file;
    
    if (Platform.OS === 'web') {
      file = uri;
    } else {
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      file = {
        uri: Platform.OS === 'ios' ? uri : uri.replace('file://', ''),
        type: `image/${fileType}`,
        name: `upload.${fileType}`,
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Upload failed');

    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    return null;
  }
}

