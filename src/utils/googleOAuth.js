import { OAuth2Client } from 'google-auth-library';
import fs from 'node:fs';
import { env } from './env.js';
import { GOOGLE_OAUTH } from '../constants/index.js';
import path from 'node:path';
import createHttpError from 'http-errors';

const googleConfigPath = path.join(process.cwd(), 'google-oauth.json');

const googleConfigParams = JSON.parse(
  fs.readFileSync(googleConfigPath).toString(),
);

const googleOAuthClient = new OAuth2Client({
  project_id: googleConfigParams.web.project_id,
  clientId: env(GOOGLE_OAUTH.GOOGLE_OAUTH_CLIENT_ID),
  clientSecret: env(GOOGLE_OAUTH.GOOGLE_OAUTH_CLIENT_SECRET),
  redirectUri: env(GOOGLE_OAUTH.GOOGLE_OAUTH_REDIRECT_URI),
});

export const generateOAuthLink = () => {
  return googleOAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
};

export const verifyCode = async (code) => {
  try {
    const { tokens } = await googleOAuthClient.getToken(code);
    const idToken = tokens.id_token;

    const ticket = await googleOAuthClient.verifyIdToken({ idToken });

    return ticket.payload;
  } catch (err) {
    console.log(err);

    if (err.status === 400) {
      throw createHttpError(err.status, 'Token is invalid');
    }
    throw createHttpError(500, 'Something is wrong with Google OAuth!');
  }
};
