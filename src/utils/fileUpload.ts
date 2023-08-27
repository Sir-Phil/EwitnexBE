import { v2 as cloudinaryV2 } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
}

const uploadImageToCloudinary = async (
  file: Express.Multer.File
): Promise<CloudinaryUploadResult> => {
  try {
    const fileBufferAsString = file.buffer.toString('base64');
    const result = (await cloudinaryV2.uploader.upload(`data:image/png;base64,${fileBufferAsString}`, {
      folder: 'uploads',
      max_file_size: 50000000, // 50mb size
      quality: 'auto:best',
      fetch_format: 'auto',
    })) as CloudinaryUploadResult;

    if (!result.url || !result.public_id) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    return {
      url: result.url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error('Error uploading image to Cloudinary');
  }
};

const uploadPDFToCloudinary = async (
  file: Express.Multer.File
): Promise<CloudinaryUploadResult> => {
  try {
    const fileBufferAsString = file.buffer.toString('base64');
    const result = (await cloudinaryV2.uploader.upload(`data:${file.mimetype};base64,${fileBufferAsString}`, {
      folder: 'uploads',
      max_file_size: 50000000, // 50mb size
    })) as CloudinaryUploadResult;

    if (!result.url || !result.public_id) {
      throw new Error('Failed to upload file to Cloudinary');
    }

    return {
      url: result.url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error('Error uploading file to Cloudinary');
  }
};


const deleteImageFromCloudinary = async (public_id: string): Promise<boolean> => {
  try {
    const result = await cloudinaryV2.uploader.destroy(public_id);
    return result.result === 'ok';
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting image from Cloudinary');
  }
};

const updateImageOnCloudinary = async (
  public_id: string,
  newFile: Express.Multer.File
): Promise<CloudinaryUploadResult> => {
  try {
    const deleteResult = await deleteImageFromCloudinary(public_id);

    if (deleteResult) {
      const newImageUrl = await uploadImageToCloudinary(newFile);
      return newImageUrl;
    } else {
      throw new Error('Failed to delete old image from Cloudinary');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error updating image on Cloudinary');
  }
};

export {
  uploadImageToCloudinary,
  uploadPDFToCloudinary,
  // ... other exports
};
