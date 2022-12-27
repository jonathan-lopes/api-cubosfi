const knexfile = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';

const loadKnexFile = {
  test: knexfile.test,
  development: knexfile.development,
  production: knexfile.production,
};

module.exports = loadKnexFile[env];
