const knexfile = require('../../knexfile');
const knex = require('knex')(
  process.env.NODE_ENV === 'test' ? knexfile.development : knexfile.production,
);

module.exports = knex;
