const loadKnexfile = require('../helpers/loadKnexfile');
const knex = require('knex')(loadKnexfile);

module.exports = knex;
