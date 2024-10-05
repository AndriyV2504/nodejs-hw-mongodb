import createHttpError from 'http-errors';
import { sessionModel } from '../models/session.js';
import { userModel } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header missing'));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Invalid authorization format'));
  }

  const session = await sessionModel.findOne({
    accessToken: token,
  });

  if (!session) {
    return next(createHttpError(401, 'Access token is expired'));
  }

  if (session.accessTokenValidUntil < new Date()) {
    return next(createHttpError(401, 'Auth token is expired'));
  }

  const user = await userModel.findById(session.userId);
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }
  req.user = user;

  next();
};
