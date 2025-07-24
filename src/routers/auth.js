import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserValidationSchema } from "../validation/registerUserValidationSchema.js";
import { loginUserController, logoutUserController, refreshSessionController, registerUserController, resetPasswordController, sendResetEmailController } from "../controllers/auth.js";
import { loginUserValidationSchema } from "../validation/loginUserValidationSchema.js";
import { sendResetEmailValidationSchema } from "../validation/sendResetEmailValidationSchema.js";
import { resetPasswordValidationSchema } from "../validation/resetPasswordValidationSchema.js";

const authRouter = Router();

authRouter.post('/auth/register', validateBody(registerUserValidationSchema), registerUserController);

authRouter.post('/auth/login', validateBody(loginUserValidationSchema), loginUserController);

authRouter.post('/auth/refresh', refreshSessionController);

authRouter.post('/auth/logout', logoutUserController);

authRouter.post('/auth/send-reset-email', validateBody(sendResetEmailValidationSchema), sendResetEmailController);

authRouter.post('/auth/reset-pwd', validateBody(resetPasswordValidationSchema),resetPasswordController);

export default authRouter;