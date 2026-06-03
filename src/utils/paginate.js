const paginate = (query = {}) => ({
  page: Math.max(1, parseInt(query.page) || 1),
  limit: Math.min(100, parseInt(query.limit) || 20),
  sort: query.sort || '-createdAt',
});

module.exports = paginate;
