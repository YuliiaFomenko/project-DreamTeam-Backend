import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: {
      type: String,
      default:
        'https://res.cloudinary.com/dbau4robp/image/upload/v1752140574/default-avatar_rfwfl3.png',
    },
    savedArticles: [{ type: Schema.Types.ObjectId, ref: 'article' }],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'Users',
  },
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const Users = model('user', userSchema);
