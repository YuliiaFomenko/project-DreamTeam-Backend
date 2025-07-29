import { CONTACT_TYPES } from '../constants/contactTypes.js';

const parseNumber = (value, defaultValue) => {
  const parsed = Number.parseInt(value);
  if (Number.isNaN(parsed)) {
    return defaultValue;
  }

  return parsed;
};

const parseSortOrder = (value) => {
  if (['asc', 'desc'].includes(value)) {
    return value;
  }
  return 'asc';
};

const parseSortBy = (value) => {
  if (['name'].includes(value)) {
    return value;
  }

  return '_id';
};

const parseType = (value) => {
  if (Object.values(CONTACT_TYPES).includes(value)) {
    return value;
  }
};

const parseBoolean = (value) => {
  if (['true', 'false'].includes(value)) {
    return JSON.parse(value);
  }
};

export const parseFilterParams = (query) => {
  return {
    type: parseType(query.type),
    isFavourite: parseBoolean(query.isFavourite),
  };
};

export const parseSortParams = (query) => {
  return {
    sortOrder: parseSortOrder(query.sortOrder),
    sortBy: parseSortBy(query.sortBy),
  };
};
