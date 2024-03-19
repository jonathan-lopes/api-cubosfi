const { BadRequestError } = require('../helpers/apiErrors');
const knex = require('../database');

const pagination = (route) => {
  return async (req, res, next) => {
    const { offset = 1, limit = 10 } = req.query;

    const offsetSize = Number(offset);
    const limitSize = Number(limit);

    const { count } = await knex(route).count('*').first();

    const total_pages = Math.ceil(Number(count) / limitSize);

    if (offsetSize > total_pages) {
      throw new BadRequestError(
        `Página solicitada fora está fora do intervalo, número de páginas máximo é ${total_pages}`,
      );
    }

    const paginationMetadata = {
      total_pages,
      total_records: Number(count),
      current_page: offsetSize,
      prev_page: offsetSize > 1,
      next_page: offsetSize < total_pages,
    };

    req.pagination = { offsetSize, limitSize };
    res.setHeader('X-Pagination', JSON.stringify(paginationMetadata));

    next();
  };
};

module.exports = pagination;
