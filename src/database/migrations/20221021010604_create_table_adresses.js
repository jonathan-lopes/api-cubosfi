const { onUpdateTrigger } = require('../../../knexfile');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema
    .createTable('adresses', (table) => {
      table.increments('id');
      table.text('street');
      table.text('complement');
      table.string('cep', 9);
      table.text('district');
      table.text('city');
      table.string('uf', 2);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .then(() => knex.raw(onUpdateTrigger('adresses')));

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('adresses');
