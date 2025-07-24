import { model, Schema } from 'mongoose';
import { CONTACT_TYPES } from '../../constants/contactTypes.js';
import { User } from './user.js';


const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: Object.values(CONTACT_TYPES),
      required: true,
      default: Object.values(CONTACT_TYPES.PERSONAL),
    },
    userId: {
      type: String,
      required: true,
      ref: User,
    },
    photo: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Contact = model('contact', contactSchema);