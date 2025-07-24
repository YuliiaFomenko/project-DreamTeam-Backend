import { Router } from "express";
import authRouter from "./auth.js";
import articleRouter from "./articles.js";
import userRouter from "./user.js";

const router = Router();

router.use(authRouter);
router.use(articleRouter);
router.use(userRouter);


export default router;