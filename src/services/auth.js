import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import crypto from 'node:crypto';
import { User } from "../db/models/user.js";
import { Session } from "../db/models/session.js";
import jwt from "jsonwebtoken";
import { getEnvVar } from "../utils/getEnvVar.js";
import { ENV_VARS } from "../constants/envVars.js";
import fs from 'node:fs';
import path from 'node:path';
import { TEMPLATE_DIR } from "../constants/paths.js";
import { sendEmail } from "../utils/sendEmail.js";
import Handlebars from 'handlebars';

const sendResetEmailTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, 'sendResetEmailTemplate.html')).toString();

const createSession = () => ({
  accessToken: crypto.randomBytes(30).toString('base64'),
  refreshToken: crypto.randomBytes(30).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + 1000 * 60 * 15),
  refreshTokenValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
});


export const registerUser = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email});

  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await User.create({
    ...payload,
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email});

  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isValidPassword = await bcrypt.compare(payload.password, user.password);

  if (!isValidPassword){
    throw createHttpError(401, 'Invalid email or password');
  }

  await Session.findOneAndDelete({userId: user._id});

  const session = await Session.create({
    userId: user._id,
    ...createSession(),
  });

  return session;
};

export const refreshSession = async ( sessionId, sessionToken) => {

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  if (!session) {
    throw createHttpError(401, 'Invalid session');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    await Session.findByIdAndDelete(sessionId);
    throw createHttpError(401, 'Session expired');
  }

  await Session.findByIdAndDelete(sessionId);

  const newSession = await Session.create({
    userId: session.userId,
    ...createSession(),
  });

  return newSession;
};

export const logoutUser = async (sessionId, sessionToken) => {
  await Session.findOneAndDelete({
    _id: sessionId,
    refreshToken: sessionToken,
  });
};

export const sendResetEmail = async (email) => {

  const user = await User.findOne({email});

  if(!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign(
  {
    sub: user._id,
    email: user.email,
  },
  getEnvVar(ENV_VARS.JWT_SECRET),
  {
    expiresIn: '5m',
  },
);

  const template = Handlebars.compile(sendResetEmailTemplate);

  const html = template({
  name: user.name,
  link: `${getEnvVar(ENV_VARS.APP_DOMAIN)}/reset-password?token=${token}`,
});

  await sendEmail({email, html, subject: 'Reset your password'});
};

export const resetPassword = async({token, password}) => {

  let tokenPayload;

  try {
    tokenPayload = jwt.verify(token, getEnvVar(ENV_VARS.JWT_SECRET));
  } catch(error){
    console.error(error);
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findById(tokenPayload.sub);

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findByIdAndUpdate(tokenPayload.sub, { password: hashedPassword });

  await Session.findOneAndDelete({ userId: tokenPayload.sub});
};