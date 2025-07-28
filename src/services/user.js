import { Users } from '../db/models/user.js';
import { createPaginationMetaData } from '../utils/createPaginationMetaData.js';

export const getTopAuthors = async (queryParams) => {
  const { page, perPage } = queryParams;
  const topAuthorsQuery = Users.aggregate([
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
    // Optionally, project only needed fields:
    {
      $project: {
        articles: 0, // exclude articles array if you don't need it
      },
    },
  ]);

  const paginationData = createPaginationMetaData(
    page,
    perPage,
    topAuthorsQueryCount,
  );
  // No contacts found
  if (queryCount === 0) {
    throw createHttpError(404, 'No contacts found matching the query');
  }

  const topAuthors = await topAuthorsQuery
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec();

  return {
    data: topAuthors,
    ...paginationData,
  };
};

export const getUserById = async (userId) => {
  // Logic to fetch user by ID from the database
  // This is a placeholder function, replace with actual implementation
};
