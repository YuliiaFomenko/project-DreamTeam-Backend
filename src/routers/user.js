import { Router } from 'express';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  addUserBookmarkController,
  getTopAuthorsController,
  getUserArticlesController,
  getUserBookmarksController,
  getUserByIdController,
  removeUserBookmarkController,
} from '../controllers/user.js';

const userRouter = Router();
// Validate ID for all users routes that require it
userRouter.use('/users/:userId', isValidId('userId'));
// Authenticate for all routes that require it
userRouter.use('/bookmarks', authenticate);
// Routes
userRouter.get('/top-authors', getTopAuthorsController);
userRouter.get('/users/:userId', getUserByIdController);
userRouter.get('/users/:userId/articles', getUserArticlesController);

userRouter.get('/bookmarks', getUserBookmarksController);
userRouter.patch(
  '/bookmarks/add/:articleId',
  isValidId('articleId'),
  addUserBookmarkController,
);
userRouter.patch(
  '/bookmarks/remove/:articleId',
  isValidId('articleId'),
  removeUserBookmarkController,
);

export default userRouter;
