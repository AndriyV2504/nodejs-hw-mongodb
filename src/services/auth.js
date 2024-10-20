import bcrypt from 'bcrypt';
import crypto, { randomBytes } from 'node:crypto';
import createHttpError from 'http-errors';
import { userModel } from '../models/user.js';
import { sessionModel } from '../models/session.js';
import {
  ACCESS_TOKEN_LIVE_TIME,
  REFRESH_TOKEN_LIVE_TIME,
} from '../constants/time.js';
import { emailContact } from '../utils/emailContact.js';
import { env } from '../utils/env.js';
import { SMTP } from '../constants/index.js';
import { genResetPwdEmail } from '../utils/genResetPwdEmail.js';
import jwt from 'jsonwebtoken';
import { generateOAuthLink, verifyCode } from '../utils/googleOAuth.js';

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

export const sendResetEmail = async (email) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(SMTP.JWT_SECRET),
    {
      expiresIn: '5m',
    },
  );

  const resetLink = `${env(
    SMTP.APP_DOMAIN,
  )}/reset-password?token=${resetToken}`;

  try {
    await emailContact.sendMail({
      to: email,
      from: env(SMTP.SMTP_FROM),
      html: genResetPwdEmail({
        name: user.name,
        resetLink: resetLink,
      }),
      subject: 'Reset your password!',
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let payload;
  try {
    payload = jwt.verify(token, env(SMTP.JWT_SECRET));
  } catch (err) {
    throw createHttpError(401, err.message);
  }
  const user = await userModel.findById(payload.sub);

  if (!user) throw createHttpError(404, 'User not found!');

  const hashedPassword = await bcrypt.hash(password, 10);

  await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
};

export const getGoogleOauthLink = () => {
  return generateOAuthLink();
};

export const verifyGoogleOAuth = async (code) => {
  const { name, email, picture } = await verifyCode(code);

  let user = await userModel.findOne({ email });

  if (!user) {
    const password = await bcrypt.hash(randomBytes(40), 10);
    user = await userModel.create({
      name,
      email,
      avatarUrl: picture,
      password,
    });
  }

  await sessionModel.deleteOne({ userId: user._id });

  return await sessionModel.create({
    userId: user._id,
    ...createSession(),
  });
};
