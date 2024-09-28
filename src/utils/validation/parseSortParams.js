const SORT_ORDER = ['asc', 'desc'];
const SORT_BY = ['name'];

export const parseSortParams = (query) => {
  const sortOrder = SORT_ORDER.includes(query.sortOrder)
    ? query.sortOrder
    : 'asc';
  const sortBy = SORT_BY.includes(query.sortBy) ? query.sortBy : 'name';

  return {
    sortOrder,
    sortBy,
  };
};
