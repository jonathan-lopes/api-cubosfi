/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('customers', (table) => {
    table.uuid('id').primary();
    table.string('name', 80).notNullable();
    table.string('email', 80).unique().notNullable();
    table.text('cpf').unique().notNullable();
    table.text('phone').notNullable();
    table.uuid('address_id');
    table
      .foreign('address_id')
      .references('id')
      .inTable('adresses')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('customers');
