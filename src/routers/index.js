import { Router } from 'express';
import authRouter from './auth.js';
import articleRouter from './articles.js';
import userRouter from './user.js';

const router = Router();

router.use(authRouter);
router.use(articleRouter);
router.use(userRouter);

router.get('/', (req, res) => {
  res.redirect('/api-docs');
});

export default router;
