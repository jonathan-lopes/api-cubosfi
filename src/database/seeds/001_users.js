const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  await knex('users').del();
  await knex('users').insert({
    name: 'sloth',
    email: 'sloth@email.com',
    password: await bcrypt.hash('sloth1234', +process.env.SALT_ROUNDS),
    cpf: '999.999.999-99',
    phone: '71999999999',
  });
};
