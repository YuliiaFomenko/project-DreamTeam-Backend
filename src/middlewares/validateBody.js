export const validateBody = (schema) => async (req, res, next) => {
  await schema.validateAsync(req.body, {
    abortEarly: false,
    allowUnknown: false,
    convert: false,
  });

  next();
};