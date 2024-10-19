import { OAuth2Client } from 'google-auth-library';
import fs from 'node:fs';
import { env } from './env.js';
import { GOOGLE_OAUTH } from '../constants/index.js';
import path from 'node:path';

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
