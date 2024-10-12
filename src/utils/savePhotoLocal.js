import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOAD_PATH } from '../constants/path.js';
import { SMTP } from '../constants/index.js';
import { env } from './env.js';

export const savePhotoLocal = async (file) => {
  const { path: oldPath, filename } = file;
  const newPath = path.join(UPLOAD_PATH, filename);

  await fs.rename(oldPath, newPath);

  return `${env(SMTP.BACKEND_DOMAIN)}/files/${filename}`;
};
