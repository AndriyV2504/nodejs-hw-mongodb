import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import createHttpError from 'http-errors';
import { userModel } from '../models/user.js';
import { sessionModel } from '../models/session.js';
import {
  ACCESS_TOKEN_LIVE_TIME,
  REFRESH_TOKEN_LIVE_TIME,
} from '../constants/time.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const session = await sessionModel.create({
    userId: user._id,
    accessToken: crypto.randomBytes(16).toString('base64'),
    refreshToken: crypto.randomBytes(16).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIVE_TIME),
  });

  return session;
};
