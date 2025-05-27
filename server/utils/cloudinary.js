import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadToCloudinary = async (data, type) => {
  const uploadResponse = await cloudinary.uploader.upload(data, {
    resource_type: type,
    folder: 'codequest_public',
  });
  return uploadResponse;
};

const deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: 'auto',
  });
};

export { uploadToCloudinary, deleteFromCloudinary };
