const sqlite = require('better-sqlite3');
const path = require('node:path');

const db = new sqlite('./test/database/db.sqlite');

db.loadExtension(path.resolve('./', 'extensions', 'uuid.so'));

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('name', 128).notNullable();
    table.string('email', 128).notNullable().unique();
    table.text('password').notNullable();
    table.text('cpf').unique().nullable();
    table.text('phone').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('users');
