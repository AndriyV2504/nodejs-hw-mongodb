import fs from 'node:fs';
import path from 'node:path';
import Handlebars from 'handlebars';
import { TEMPLATES_PATH } from '../constants/path.js';

const template = fs
  .readFileSync(path.join(TEMPLATES_PATH, 'reset-password-email.html'))
  .toString();

export const genResetPwdEmail = ({ name, resetLink }) => {
  const handleBarsTemplate = Handlebars.compile(template);

  return handleBarsTemplate({ name, resetLink });
};
