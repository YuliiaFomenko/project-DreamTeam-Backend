import createHttpError from 'http-errors';
import { Users } from '../db/models/user.js';
import { Article } from '../db/models/article.js';
import { createPaginationMetaData } from '../utils/pagination.js';

// =============================================================================
// Top authors =================================================================
export const getTopAuthors = async (queryParams) => {
  const { page, perPage } = queryParams;
  const result = await Users.aggregate([
    {
      $lookup: {
        from: 'Articles', // collection to join
        localField: '_id', // field from Users
        foreignField: 'ownerId', // field from Articles
        as: 'articles',
      },
    },
    {
      $addFields: {
        articlesAmount: { $size: '$articles' }, // count articles for each user
      },
    },
    {
      $sort: { articlesAmount: -1 }, // sort by articlesAmount descending
    },
    {
      $project: {
        articles: 0, // exclude articles array since we don't need it
      },
    },
    {
      $match: {
        articlesAmount: { $gt: 0 }, // only users with articles
      },
    },
    {
      $facet: {
        data: [{ $skip: (page - 1) * perPage }, { $limit: perPage }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);
  const topAuthors = result[0].data;
  const queryCount = result[0].totalCount[0]?.count || 0;
  // No users found:
  if (queryCount === 0)
    throw createHttpError(404, 'No users found matching the query');

  const paginationData = createPaginationMetaData(page, perPage, queryCount);
  return {
    data: topAuthors,
    ...paginationData,
  };
};
// =============================================================================
// User by ID =================================================================
export const getUserById = async (userId) => {
  const user = await Users.findOne({ _id: userId });
  if (!user) throw createHttpError(404, `User with ID:${userId} was not found`);
  return user;
};
// =============================================================================
// Articles, created by user(_id => ownerId) ===============================
export const getUserArticles = async (userId, queryParams) => {
  const { page, perPage } = queryParams;
  const articlesQuery = Article.find({ ownerId: userId });

  const articlesCount = await Article.countDocuments({
    ownerId: userId,
  });
  // if (articlesCount === 0)
  //   throw createHttpError(404, 'No articles found for user with ID:' + userId);

  const paginationData = createPaginationMetaData(page, perPage, articlesCount);
  const articles = await articlesQuery
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

  return {
    data: articles,
    ...paginationData,
  };
};
// =============================================================================
// Bookmarks for currently logged in user ===============================
export const getUserBookmarks = async (userId, queryParams) => {
  const user = await Users.findOne({ _id: userId }).populate('savedArticles');
  if (!user) throw createHttpError(404, 'User not found');
  if (!Array.isArray(user.savedArticles) || user.savedArticles.length === 0)
    throw createHttpError(404, 'No bookmarks found for logged in user');

  const { page, perPage } = queryParams;
  const paginationData = createPaginationMetaData(
    page,
    perPage,
    user.savedArticles.length,
  );
  const start = (paginationData.page - 1) * paginationData.perPage;
  const end = start + paginationData.perPage;
  const paginatedArticles = user.savedArticles.slice(start, end);

  return {
    data: paginatedArticles,
    ...paginationData,
  };
};
// =============================================================================
// Add bookmark for currently logged in user ===============================
export const addUserBookmark = async (userId, articleId) => {
  // Check if article exists and increment its rate
  const article = await Article.findByIdAndUpdate(articleId, {
    $inc: { rate: 1 },
  });
  if (!article) throw createHttpError(404, 'Article not found');
  // If article exists, proceed with updating User
  const user = await Users.findOne({ _id: userId });
  if (!user) throw createHttpError(404, 'User not found');
  // Use .toString() for robust comparison (ObjectId vs string)
  const alreadyBookmarked = user.savedArticles.some(
    (id) => id.toString() === articleId.toString(),
  );
  if (alreadyBookmarked) return user;
  const updatedUser = await Users.findOneAndUpdate(
    { _id: userId },
    { $push: { savedArticles: articleId } },
    { new: true },
  );
  return updatedUser;
};
// =============================================================================
// Remove bookmark for currently logged in user ===============================
export const removeUserBookmark = async (userId, articleId) => {
  // Try to decrement article rate but do not fall below zero
  const article = await Article.findById(articleId);
  if (!article) throw createHttpError(404, 'Article not found');
  if (article.rate > 0)
    await Article.findByIdAndUpdate(articleId, {
      $inc: { rate: -1 },
    });
  // Proceed with updating User
  const updatedUser = await Users.findOneAndUpdate(
    { _id: userId },
    { $pull: { savedArticles: articleId } },
    { new: true },
  );
  if (!updatedUser) throw createHttpError(404, 'User not found');
  return updatedUser;
};
