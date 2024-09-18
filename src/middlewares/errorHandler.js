import { HttpError } from 'http-errors';

export const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.name,
      error: err.message,
    });
  }
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
};
