import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../services/articles.js';
import createHttpError from 'http-errors';
import { saveFile } from '../utils/saveFile.js';
import {
  parsePaginationParams,
  parseSortParams,
  parseFilterParams,
} from '../utils/pagination.js';
import { formatArticleDate } from '../utils/formatArticleDate.js';

export const getAllArticlesController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const articles = await getAllArticles({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
    });

    res.json({
      status: 200,
      message: 'Successfully found articles!',
      data: articles,
    });
  } catch (err) {
    next(err);
  }
};

export const getArticleByIdController = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const article = await getArticleById(articleId);

    if (!article) {
      throw createHttpError(404, 'Article not found');
    }

    res.json({
      status: 200,
      message: `Successfully fpund article with id ${articleId}`,
      data: article,
    });
  } catch (err) {
    next(err);
  }
};

export const createArticleController = async (req, res, next) => {
  try {
    const { title, desc, date: dateString } = req.body;

    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: '"image" is required',
      });
    }
    const img = await saveFile(req.file);

    const date = new Date(dateString);

    const newArticle = await createArticle({
      title,
      desc,
      img,
      date,
      rate: 0,
      ownerId: req.user._id,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created an article!',
      data: formatArticleDate(newArticle),
    });
  } catch (err) {
    next(err);
  }
};

export const patchArticleController = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const result = await updateArticle(articleId, req.body);

    if (!result) {
      next(createHttpError(404, 'Article not found'));
      return;
    }

    res.json({
      status: 200,
      message: 'Successfully patched an article!',
      data: result.article,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteArticleController = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const article = await deleteArticle(articleId);

    if (!article) {
      next(createHttpError(404, 'Article not found'));
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
