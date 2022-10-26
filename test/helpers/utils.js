const bcrypt = require('bcrypt');
const knex = require('../../src/database/connection');

const createSut = async () => {
  const user = {
    name: 'testman',
    email: 'testman@email.com',
    password: await bcrypt.hash('testman1234', +process.env.SALT_ROUNDS),
  };

  const id = await knex('users').insert(user).returning(['id']);

  return { id, name: user.name, email: user.email, password: 'testman1234' };
};

const clear = async () => {
  await knex('users').del().where({ email: 'testman@email.com' });
};

module.exports = {
  createSut,
  clear,
};
