const BOOLEANS = ['true', 'false'];
const parseBoolean = (value) => {
  if (!BOOLEANS.includes(value)) return;
  return value === 'true' ? true : false;
};

const TYPES = ['personal', 'work', 'home'];
const parseType = (value) => {
  if (TYPES.includes(value)) return value;
};

export const parseFilterParams = (query) => {
  return {
    isFavorite: parseBoolean(query.isFavorite),
    type: parseType(query.type),
  };
};
