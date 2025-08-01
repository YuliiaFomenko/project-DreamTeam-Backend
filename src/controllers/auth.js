import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from '../services/auth.js';

// Helper function to set up session cookies
const setupSessionCookies = (session, res) => {
  res.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};
// ================================ Controllers:
// Register a user
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body, req.file);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered!',
    data: user,
  });
};
// Login a user
export const loginUserController = async (req, res) => {
  const { sessionToken, sessionId } = req.cookies;
  if (sessionToken && sessionId) await logoutUser(sessionId, sessionToken);

  const data = await loginUser(req.body);

  setupSessionCookies(data.session, res);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in!',
    data: {
      accessToken: data.session.accessToken,
      currentUser: data.user,
    },
  });
};
// Refresh user's session
export const refreshSessionController = async (req, res) => {
  const { sessionId, sessionToken } = req.cookies;

  const data = await refreshSession(sessionId, sessionToken);

  setupSessionCookies(data.session, res);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: data.session.accessToken,
      currentUser: data.user,
    },
  });
};
// Logout a user
export const logoutUserController = async (req, res) => {
  const { sessionId, sessionToken } = req.cookies;

  await logoutUser(sessionId, sessionToken);

  res.clearCookie('sessionId');
  res.clearCookie('sessionToken');

  res.status(204).send();
};
