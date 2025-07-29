export const formatArticleDate = (article) => {
  if (!article) {
    return null;
  }

  const obj = article.toObject ? article.toObject() : { ...article };

  if (obj.date) {
    obj.date = obj.date.toISOString().split('T')[0];
  }

  return obj;
};
