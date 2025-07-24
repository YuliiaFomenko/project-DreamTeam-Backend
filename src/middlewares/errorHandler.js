import { HttpError } from 'http-errors';

export const errorHandlerMiddleware = (error, req, res, next) => {

  if (error.isJoi){
    return res.status(400).json({
      status: 400,
      errorMessage: 'Validation error',
      id: req.id,
      details: error.details.map(({ path, message }) => ({
        path, 
        message,
      })),
    });
  }

  if (error instanceof HttpError){
    res.status(error.status).json({
      status: error.status,
      message: error.message,
      data: error,
    });
    return;
  }


  res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: error.message,
    });
};
