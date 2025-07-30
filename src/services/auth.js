import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { Users } from '../db/models/user.js';
import { Sessions } from '../db/models/session.js';
import { saveFile } from '../utils/saveFile.js';

const createSession = () => ({
  accessToken: crypto.randomBytes(30).toString('base64'),
  refreshToken: crypto.randomBytes(30).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + 1000 * 60 * 15),
  refreshTokenValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
});

// ================================ Services:
// Register a user
export const registerUser = async (payload, file) => {
  if (file) {
    payload.avatarUrl = await saveFile(file);
  }

  const existingUser = await Users.findOne({ email: payload.email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await Users.create({
    ...payload,
    password: hashedPassword,
  });

  return user;
};
// Login a user
export const loginUser = async (payload) => {
  const user = await Users.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(401, 'Unregistered email');
  }

  const isValidPassword = await bcrypt.compare(payload.password, user.password);

  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid password');
  }

  await Sessions.findOneAndDelete({ userId: user._id });

  const session = await Sessions.create({
    userId: user._id,
    ...createSession(),
  });

  return { session, userId: user._id };
};
// Refresh user's session
export const refreshSession = async (sessionId, sessionToken) => {
  const session = await Sessions.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found, please log in again');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    await Sessions.findByIdAndDelete(sessionId);
    throw createHttpError(401, 'Session expired, please log in again');
  }

  await Sessions.findByIdAndDelete(sessionId);

  const newSession = await Sessions.create({
    userId: session.userId,
    ...createSession(),
  });

  return { session: newSession, userId: session.userId };
};
// Logout a user
export const logoutUser = async (sessionId, sessionToken) => {
  await Sessions.findOneAndDelete({
    _id: sessionId,
    refreshToken: sessionToken,
  });
};
