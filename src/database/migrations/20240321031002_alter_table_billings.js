/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.alterTable('billings', (table) => {
    table.datetime('due').notNullable().alter();
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) =>
  knex.schema.alterTable('billings', (table) => {
    table.date('due').notNullable().alter();
  });
