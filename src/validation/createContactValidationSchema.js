import Joi from "joi";
import { CONTACT_TYPES } from "../constants/contactTypes.js";

export const createContactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string().valid(...Object.values(CONTACT_TYPES)).default(CONTACT_TYPES.PERSONAL).required(),
});

