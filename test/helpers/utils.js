const bcrypt = require('bcrypt');
const knex = require('../../src/database/connection');

class SutUser {
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

class SutCustomer {
  #name;
  #email;
  #cpf;
  #phone;

  constructor(name, email, cpf, phone) {
    this.#name = name;
    this.#email = email;
    this.#cpf = cpf;
    this.#phone = phone;
  }

  async create() {
    const [data] = await knex('customers')
      .insert({
        name: this.#name,
        email: this.#email,
        cpf: this.#cpf,
        phone: this.#phone,
      })
      .returning(['id', 'name', 'email', 'cpf', 'phone', 'address_id']);

    return data;
  }

  async clear() {
    await knex('customers').del().where({ email: this.#email });
  }
}

class SutBilling {
  #customer_id;
  #description;
  #status;
  #value;
  #due;

  constructor(customer_id, description, status, value, due) {
    this.#customer_id = customer_id;
    this.#description = description;
    this.#status = status;
    this.#value = value;
    this.#due = due;
  }

  async create() {
    const [data] = await knex('billings')
      .insert({
        customer_id: this.#customer_id,
        description: this.#description,
        status: this.#status,
        value: this.#value,
        due: this.#due,
      })
      .returning([
        'id',
        'description',
        'status',
        'value',
        'due',
        'customer_id',
      ]);

    return data;
  }

  async clear() {
    await knex('billings').del().where({ customer_id: this.#customer_id });
  }
}

module.exports = { SutCustomer, SutUser, SutBilling };
