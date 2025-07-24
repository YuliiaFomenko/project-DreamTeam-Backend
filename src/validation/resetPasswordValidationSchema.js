import Joi from "joi";

export const resetPasswordValidationSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).max(30).required(),
});