import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure the SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string | undefined = process.env.FOLDER_NAME
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'raw', // Automatically detects image/video/pdf
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Upload failed: No result from Cloudinary"));
        resolve(result);
      }
    );

    // Write the buffer to the stream and end it
    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;