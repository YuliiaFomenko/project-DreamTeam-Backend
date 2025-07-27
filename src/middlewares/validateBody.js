import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw createHttpError(400, 'Request body is required and cannot be empty');
  }
  await schema.validateAsync(req.body, {
    abortEarly: false,
    allowUnknown: false,
    convert: false,
  });

  next();
};
