import createHttpError from 'http-errors';
import { SORT_ORDER } from '../constants/envVars.js';

const parseNumber = (value, defaultValue) => {
  const parsed = Number.parseInt(value);
  if (Number.isNaN(parsed)) {
    return defaultValue;
  }
  return parsed;
};

const parseString = (value) => {
  if (typeof value !== 'string') return;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const parseDate = (value) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) return;
};

const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) return sortOrder;
  return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  const keysOfContact = ['_id', 'rate'];

  if (keysOfContact.includes(sortBy)) {
    return sortBy;
  }

  return '_id';
};

export const parsePaginationParams = (query) => {
  return {
    page: parseNumber(query.page, 1),
    perPage: parseNumber(query.perPage, 12),
  };
};

export const parseSortParams = (query) => {
  let { sortOrder, sortBy, filter } = query;
  if (filter === 'popular') {
    sortBy = 'rate';
    sortOrder = 'desc';
  }

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};

export const parseFilterParams = (query) => {
  const { minRate, maxRate, title, ownerId, dateFrom, dateTo } = query;

  const parsedMinRate = parseNumber(minRate);
  const parsedMaxRate = parseNumber(maxRate);
  const parsedTitle = parseString(title);
  const parsedOwnerId = parseString(ownerId);
  const parsedDateFrom = parseDate(dateFrom);
  const parsedDateTo = parseDate(dateTo);

  return {
    minRate: parsedMinRate,
    maxRate: parsedMaxRate,
    title: parsedTitle,
    ownerId: parsedOwnerId,
    dateFrom: parsedDateFrom,
    dateTo: parsedDateTo,
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
