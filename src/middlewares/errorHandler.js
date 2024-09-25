import { HttpError } from 'http-errors';

export const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.name,
      error: err.message,
    });
  }

  if (err.isJoi) {
    return res.status(400).json({
      message: 'Validation error',
      error: err.message,
      details: err.details.map((error) => ({
        message: error.message,
        path: error.path,
      })),
    });
  }

  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
};
