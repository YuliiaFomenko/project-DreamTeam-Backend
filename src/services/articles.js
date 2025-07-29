import { Article } from '../db/models/article.js';
import { createPaginationMetaData } from '../utils/pagination.js';
import { formatArticleDate } from '../utils/formatArticleDate.js';

export const getAllArticles = async ({
  page = 1,
  perPage = 12,
  sortOrder = 'desc',
  sortBy = 'rate',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const articlesQuery = Article.find();
  if (filter.minRate) {
    articlesQuery.where('rate').gte(filter.minRate);
  }

  if (filter.maxRate) {
    articlesQuery.where('rate').lte(filter.maxRate);
  }

  if (filter.ownerId) {
    articlesQuery.where('ownerId').equals(filter.ownerId);
  }

  if (filter.title) {
    articlesQuery.where('title').regex(new RegExp(filter.title, 'i'));
  }

  if (filter.dateFrom) {
    articlesQuery.where('date').gte(filter.dateFrom);
  }

  if (filter.dateTo) {
    articlesQuery.where('date').lte(filter.dateTo);
  }

  const [articlesCount, articles] = await Promise.all([
    Article.find().merge(articlesQuery).countDocuments(),
    articlesQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const articlesFormatted = articles.map(formatArticleDate);

  const paginationData = createPaginationMetaData(page, perPage, articlesCount);
  return {
    data: articlesFormatted,
    ...paginationData,
  };
};

export const getArticleById = async (articleId) => {
  const article = await Article.findById(articleId);
  return formatArticleDate(article);
};

export const createArticle = async (payload) => {
  return await Article.create(payload);
};

export const updateArticle = async (articleId, payload, options = {}) => {
  const rawResult = await Article.findOneAndUpdate(
    { _id: articleId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    article: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteArticle = async (articleId) => {
  const article = await Article.findOneAndDelete({
    _id: articleId,
  });

  return article;
};
