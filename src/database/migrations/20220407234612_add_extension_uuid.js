/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
