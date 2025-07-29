import { model, Schema } from 'mongoose';

const articleSchema = new Schema(
  {
    img: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    rate: { type: Number, default: 0 },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'Articles',
  },
);

export const Article = model('article', articleSchema);
