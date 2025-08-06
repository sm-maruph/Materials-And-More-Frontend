// src/utils/productMatcher.js
export const normalize = (text) =>
  text?.toLowerCase().replace(/[\s/-]+/g, "") ?? "";

export const matchCategoryAndSubcategory = (db, routeCategory, routeSubcategory) => {
  const normalizedCat = normalize(routeCategory);
  const normalizedSub = normalize(routeSubcategory);

  const matchedCategoryKey = Object.keys(db).find(
    (key) => normalize(key) === normalizedCat
  );

  const availableCategory = matchedCategoryKey ? db[matchedCategoryKey] : null;
  const subItems = availableCategory ? Object.keys(availableCategory) : [];

  const matchedSubKey =
    availableCategory &&
    Object.keys(availableCategory).find(
      (key) => normalize(key) === normalizedSub
    );

  const products = matchedSubKey
    ? availableCategory[matchedSubKey]
    : availableCategory
    ? Object.values(availableCategory).flat()
    : [];

  return {
    matchedCategoryKey,
    matchedSubKey,
    subItems,
    products,
    availableCategory,
  };
};
