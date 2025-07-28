import createHttpError from 'http-errors';
import { Sessions } from '../db/models/session.js';
import { Users } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throw createHttpError(401, 'Authorization header is missing');
  }

  const [bearer, token] = authHeader.split(' ');
  if (!(bearer === 'Bearer' && typeof token === 'string')) {
    throw createHttpError(401, 'Expecting "Bearer" authorization token');
  }

  const session = await Sessions.findOne({ accessToken: token });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (session.accessTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Access token expired');
  }

  const user = await Users.findById(session.userId);
  if (!user) {
    await Sessions.deleteOne({ _id: session._id });
    throw createHttpError(401, "Unknown user's session is closed");
  }

  req.user = user;

  next();
};
