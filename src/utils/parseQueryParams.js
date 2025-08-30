export const parseQueryParams = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.perPage || query.limit, 10) || 10;

  const sortBy = query.sortBy || 'name';
  const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';

  const filter = {};
  if (query.contactType) {
    filter.contactType = query.contactType;
  }
  if (query.isFavourite !== undefined) {
    filter.isFavourite = query.isFavourite === 'true';
  }

  return { page, limit, sortBy, sortOrder, filter };
};
