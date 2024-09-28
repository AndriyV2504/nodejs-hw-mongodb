const parseInt = (value, defaultValue) => {
  if (!value) return defaultValue;

  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) return defaultValue;

  return parsedValue;
};

export const validatePaginationParams = (query) => {
  const page = parseInt(query.page, 1);
  const perPage = parseInt(query.perPage, 10);

  return {
    page,
    perPage,
  };
};
