import { getTopAuthors } from '../services/user.js';
import { getUserById } from '../services/user.js';
import { parsePaginationParams } from '../utils/parse-helpers.js';

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
    message: `Successfully found user with ID ${userId} !`,
    data,
  });
};
