import Joi from 'joi';

export const createArticleSchema = Joi.object({
  title: Joi.string().min(3).max(48).required(),
  article: Joi.string().min(100).max(4000).required(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
});
