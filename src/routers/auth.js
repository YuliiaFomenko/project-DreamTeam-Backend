import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserValidationSchema,
  loginUserValidationSchema,
} from '../validation/auth.js';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
} from '../controllers/auth.js';
import { upload } from '../middlewares/uploadFiles.js';

const authRouter = Router();

authRouter.post(
  '/auth/register',
  upload.single('avatar'),
  validateBody(registerUserValidationSchema),
  registerUserController,
);

authRouter.post(
  '/auth/login',
  validateBody(loginUserValidationSchema),
  loginUserController,
);

authRouter.get('/auth/refresh', refreshSessionController);

authRouter.post('/auth/logout', logoutUserController);

export default authRouter;
