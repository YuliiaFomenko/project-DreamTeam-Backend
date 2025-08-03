import { Router } from 'express';
import {
  getAllArticlesController,
  getArticleByIdController,
  createArticleController,
  patchArticleController,
  deleteArticleController,
  getRandomArticlesController,
} from '../controllers/articles.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createArticleSchema } from '../validation/createArticleValidationSchema.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/uploadFiles.js';

const articleRouter = Router();

articleRouter.get('/articles', getAllArticlesController);

articleRouter.get('/articles/random', getRandomArticlesController);

articleRouter.get(
  '/articles/:articleId',
  isValidId('articleId'),
  getArticleByIdController,
);

articleRouter.post(
  '/articles',
  authenticate,
  upload.single('img'),
  validateBody(createArticleSchema),
  createArticleController,
);
articleRouter.patch(
  '/articles/:articleId',
  isValidId('articleId'),
  authenticate,
  upload.single('img'),
  patchArticleController,
);
articleRouter.delete(
  '/articles/:articleId',
  isValidId('articleId'),
  authenticate,
  deleteArticleController,
);

export default articleRouter;
