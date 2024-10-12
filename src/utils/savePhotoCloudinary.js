import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';
import { env } from './env.js';
import { SMTP } from '../constants/index.js';

cloudinary.config({
  cloud_name: env(SMTP.CLOUDINARY_CLOUD_NAME),
  api_key: env(SMTP.CLOUDINARY_API_KEY),
  api_secret: env(SMTP.CLOUDINARY_API_SECRET),
});

export const savePhotoCloudinary = async (file) => {
  const res = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);

  return res.secure_url;
};
