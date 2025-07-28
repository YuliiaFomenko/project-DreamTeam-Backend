import { Router } from 'express';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getTopAuthorsController,
  getUserByIdController,
} from '../controllers/user.js';

const userRouter = Router();
// Validate ID for all routes that require it
userRouter.use('/users/:userId', isValidId('userId'));
// Authenticate for all routes that require it
userRouter.use('/users/:userId/bookmarks', authenticate);
// Routes
userRouter.get('/users/authors', getTopAuthorsController);
userRouter.get('/users/:userId', getUserByIdController);
//userRouter.get('/users/:userId/articles', getUserArticlesController);
//userRouter.get('/users/:userId/bookmarks', getUserBookmarksController);
//userRouter.get('/users/:userId/bookmarks/add', addUserBookmarkController);
//userRouter.get('/users/:userId/bookmarks/remove', removeUserBookmarkController);

export default userRouter;
