const { randomUUID } = require('node:crypto');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('adresses', (table) => {
    table.uuid('id').primary();
    table.text('street');
    table.text('complement');
    table.string('cep', 9);
    table.text('district');
    table.text('city');
    table.string('uf', 2);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('adresses');
