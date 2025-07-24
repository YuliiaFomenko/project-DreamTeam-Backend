import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import crypto from 'node:crypto';
import { User } from "../db/models/user.js";
import { Session } from "../db/models/session.js";

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

