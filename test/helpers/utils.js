const bcrypt = require('bcrypt');
const knex = require('../../src/database/connection');
const { v4: uuidv4 } = require('uuid');

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
        id: uuidv4(),
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
        id: uuidv4(),
        name: this.#name,
        email: this.#email,
        cpf: this.#cpf,
        phone: this.#phone,
      })
      .returning(['id', 'name', 'email', 'cpf', 'phone']);

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
        id: uuidv4(),
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
        'is_overdue',
      ]);

    return data;
  }

  async clear() {
    await knex('billings').del().where({ customer_id: this.#customer_id });
  }
}

class SutRefreshToken {
  #refresh_token;
  #expires_date;
  #user_id;

  constructor(refresh_token, expires_date, user_id) {
    this.#refresh_token = refresh_token;
    this.#expires_date = expires_date;
    this.#user_id = user_id;
  }

  async create() {
    const [data] = await knex('user_token')
      .insert({
        id: uuidv4(),
        refresh_token: this.#refresh_token,
        expires_date: this.#expires_date,
        user_id: this.#user_id,
      })
      .returning(['id', 'refresh_token', 'expires_date', 'user_id']);

    return data;
  }

  async clear() {
    await knex('user_token').del().where({ user_id: this.#user_id });
  }
}

module.exports = { SutCustomer, SutUser, SutBilling, SutRefreshToken };
