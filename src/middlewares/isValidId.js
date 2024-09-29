import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId =
  (idName = 'contactId') =>
  (req, res, next) => {
    const contactId = req.params[idName];

    if (!isValidObjectId(contactId)) {
      return next(createHttpError(400, 'Invalid contact ID'));
    }
    next();
  };
