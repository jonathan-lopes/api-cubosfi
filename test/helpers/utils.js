const bcrypt = require('bcrypt');
const knex = require('../../src/database/connection');

class Sut {
  #name = '';
  #email = '';
  #password = '';

  constructor(name, email, password) {
    this.#name = name;
    this.#email = email;
    this.#password = password;
  }

  async create() {
    const [data] = await knex('users')
      .insert({
        name: this.#name,
        email: this.#email,
        password: await bcrypt.hash(this.#password, +process.env.SALT_ROUNDS),
      })
      .returning(['id', 'name', 'email', 'cpf', 'phone']);

    data.password = this.#password;

    return data;
  }

  async clear() {
    await knex('users').del().where({ email: this.#email });
  }
}

module.exports = Sut;
