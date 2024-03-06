const { randomUUID } = require('node:crypto');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('billings', (table) => {
    table.uuid('id').primary();
    table.string('description', 128).notNullable();
    table.enu('status', ['paid', 'pending']).notNullable();
    table.integer('value').notNullable();
    table.date('due').notNullable();
    table.boolean('is_overdue').defaultTo(false);
    table.uuid('customer_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table
      .foreign('customer_id')
      .references('id')
      .inTable('customers')
      .onDelete('CASCADE');
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('billings');
