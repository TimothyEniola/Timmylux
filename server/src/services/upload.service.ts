import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = 'timmylux'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );

    const readableStream = Readable.from(buffer);
    readableStream.pipe(uploadStream);
  });
};

export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[],
  folder: string = 'timmylux'
): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, folder));
  return Promise.all(uploadPromises);
};

export const deleteFromCloudinary = async (url: string): Promise<void> => {
  const publicId = url.split('/').slice(-2).join('/').split('.')[0];
  await cloudinary.uploader.destroy(publicId);
};