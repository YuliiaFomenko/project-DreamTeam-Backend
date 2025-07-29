import {
  getTopAuthors,
  getUserById,
  getUserArticles,
  getUserBookmarks,
  addUserBookmark,
  removeUserBookmark,
} from '../services/user.js';
import { parsePaginationParams } from '../utils/pagination.js';

// (GET) Top creators - users who have articles,
//  sorted by articles amount descending
export const getTopAuthorsController = async (req, res) => {
  const queryParams = {
    ...parsePaginationParams(req.query),
  };
  const data = await getTopAuthors(queryParams);
  res.json({
    status: 200,
    message: 'Successfully found authors!',
    data,
  });
};
// (GET) User by ID
export const getUserByIdController = async (req, res) => {
  const { userId } = req.params;
  const data = await getUserById(userId);
  res.json({
    status: 200,
    message: `Successfully found user with ID:${userId} !`,
    data,
  });
};
// (GET) Articles by user's ID
export const getUserArticlesController = async (req, res) => {
  const { userId } = req.params;
  const queryParams = {
    ...parsePaginationParams(req.query),
  };
  const data = await getUserArticles(userId, queryParams);
  res.json({
    status: 200,
    message: `Successfully found articles for user with ID:${userId}!`,
    data,
  });
};
// (GET) Bookmarks for logged in user
export const getUserBookmarksController = async (req, res) => {
  const queryParams = {
    ...parsePaginationParams(req.query),
  };
  const data = await getUserBookmarks(req.user._id, queryParams);
  res.json({
    status: 200,
    message: `Successfully found bookmarks for logged in user!`,
    data,
  });
};
// (PATCH) Add bookmark for logged in user
export const addUserBookmarkController = async (req, res) => {
  const { articleId } = req.params;
  const data = await addUserBookmark(req.user._id, articleId);
  res.json({
    status: 200,
    message: `Successfully updated!`,
    data,
  });
};
// (PATCH) Remove bookmark for logged in user
export const removeUserBookmarkController = async (req, res) => {
  const { articleId } = req.params;
  const data = await removeUserBookmark(req.user._id, articleId);
  res.json({
    status: 200,
    message: `Successfully updated!`,
    data,
  });
};
