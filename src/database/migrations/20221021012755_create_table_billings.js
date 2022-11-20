const { onUpdateTrigger } = require('../../../knexfile');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema
    .createTable('billings', (table) => {
      table.increments('id');
      table.string('description', 128).notNullable();
      table.enu('status', ['paid', 'pending']).notNullable();
      table.integer('value').notNullable();
      table.date('due').notNullable();
      table.boolean('is_overdue').defaultTo(false);
      table.integer('customer_id').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table
        .foreign('customer_id')
        .references('id')
        .inTable('customers')
        .onDelete('CASCADE');
    })
    .then(() => knex.raw(onUpdateTrigger('billings')));

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('billings');
