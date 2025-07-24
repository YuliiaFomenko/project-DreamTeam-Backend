import { model, Schema } from "mongoose";
import { Article } from "./article";

const userSchema = new Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true,unique: true},
    password: {type: String,required: true},
    avatarUrl: {type: String, default: null},
    savedArticles: [{type: Schema.Types.ObjectId, ref: Article}],
    createdArticles: [{type: Schema.Types.ObjectId, ref: Article}]},
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = model('user', userSchema);
