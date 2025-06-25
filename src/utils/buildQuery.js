const buildQuery = ({ page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite }) => {
    const skip = (page - 1) * perPage;
  
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }
  
    const filter = {};
    if (type) {
      filter.contactType = type;
    }
    if (isFavourite !== undefined) {
      filter.isFavourite = isFavourite === 'true'; 
    }
  
    return { skip, limit: Number(perPage), sort, filter, page: Number(page), perPage: Number(perPage) };
  };
  
  module.exports = buildQuery;
  