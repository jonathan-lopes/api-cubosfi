const knex = require('knex');
const loadKnexfile = require('../helpers/loadKnexfile');

module.exports = knex(loadKnexfile);
