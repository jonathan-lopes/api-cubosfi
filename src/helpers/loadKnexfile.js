const knexfile = require('../../knexfile');

const loadKnexfile = () => {
  const env = process.env.NODE_ENV;

  switch (env) {
    case 'test':
      return knexfile.test;
    case 'development':
      return knexfile.development;
    case 'production':
      return knexfile.production;
    default:
      return knexfile.production;
  }
};

module.exports = loadKnexfile;
