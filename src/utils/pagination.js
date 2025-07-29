import createHttpError from 'http-errors';

const parseNumber = (value, defaultValue) => {
  const parsed = Number.parseInt(value);
  if (Number.isNaN(parsed)) {
    return defaultValue;
  }
  return parsed;
};

export const parsePaginationParams = (query) => {
  return {
    page: parseNumber(query.page, 1),
    perPage: parseNumber(query.perPage, 10),
  };
};

export const createPaginationMetaData = (page, perPage, count) => {
  const totalPages = Math.ceil(count / perPage);
  const hasPreviousPage = page !== 1 && page <= totalPages;
  const hasNextPage = totalPages > page;

  if (page > totalPages && totalPages > 0) {
    throw createHttpError(
      400,
      `Page ${page} is out of range. Total pages: ${totalPages}`,
    );
  }

  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};
