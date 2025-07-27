import { HttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

export const errorHandlerMiddleware = (error, req, res, next) => {
  if (error.isJoi) {
    return res.status(400).json({
      status: 400,
      message: 'Validation error occurred',
      // id: req.id,
      data: {
        errorMessage: error.details.map(({ path, message }) => ({
          path,
          message,
        })),
      },
    });
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({
      status: error.status,
      message: 'HTTP error occurred',
      data: {
        errorMessage: error.message,
      },
    });
    return;
  }

  if (error instanceof MongooseError) {
    return res.status(500).json({
      status: 500,
      message: 'MongoDB error occurred',
      data: {
        errorMessage: error.message,
      },
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: {
      errorMessage: error.message,
    },
  });
};
