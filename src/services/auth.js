import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import createHttpError from 'http-errors';
import { userModel } from '../models/user.js';
import { sessionModel } from '../models/session.js';
import {
  ACCESS_TOKEN_LIVE_TIME,
  REFRESH_TOKEN_LIVE_TIME,
} from '../constants/time.js';

const createSession = () => ({
  accessToken: crypto.randomBytes(16).toString('base64'),
  refreshToken: crypto.randomBytes(16).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
  refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIVE_TIME),
});

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

  await sessionModel.deleteOne({ userId: user._id });

  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const session = await sessionModel.create({
    userId: user._id,
    ...createSession(),
  });

  return session;
};

export const logoutUser = async (sessionId, sessionToken) => {
  await sessionModel.deleteOne({ _id: sessionId, refreshToken: sessionToken });
};

export const refreshSession = async (sessionId, sessionToken) => {
  const session = await sessionModel.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const now = new Date();

  if (session.refreshTokenValidUntil < now) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await sessionModel.deleteOne({ _id: sessionId, refreshToken: sessionToken });

  const newSession = await sessionModel.create({
    userId: session.userId,
    ...createSession(),
  });

  return newSession;
};
