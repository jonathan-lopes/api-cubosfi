const { BadRequestError } = require('../helpers/apiErrors');
const knex = require('../database');

const pagination = (route) => {
  return async (req, res, next) => {
    const { page = 1, page_size = 20 } = req.query;

    const pageNumber = Number(page);
    const pageSize = Number(page_size);

    const { count } = await knex(route).count('* as count').first();

    const CalculateTotalPages = Math.ceil(Number(count) / pageSize);

    const total_pages = CalculateTotalPages === 0 ? 1 : CalculateTotalPages;

    const paginationMetadata = {
      total_pages,
      total_records: Number(count),
      current_page: pageNumber,
      prev_page: pageNumber > 1,
      next_page: pageNumber < total_pages,
    };

    res.setHeader('X-Pagination', JSON.stringify(paginationMetadata));

    if (pageNumber > total_pages) {
      throw new BadRequestError(
        `Página solicitada fora está fora do intervalo, número de páginas máximo é ${total_pages}`,
      );
    }

    req.pagination = { pageNumber, pageSize };

    next();
  };
};

module.exports = pagination;
