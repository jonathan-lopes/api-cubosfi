const bcrypt = require('bcrypt');
const knex = require('../../src/database');
const { v4: uuidv4 } = require('uuid');

class SutUser {
  #user;

  constructor(user) {
    this.#user = Object.assign({}, user);
  }

  async create() {
    const [data] = await knex('users')
      .insert({
        id: uuidv4(),
        name: this.#user.name,
        email: this.#user.email,
        password: await bcrypt.hash(
          this.#user.password,
          +process.env.SALT_ROUNDS,
        ),
      })
      .returning(['id', 'name', 'email', 'cpf', 'phone']);

    data.password = this.#user.password;

    return data;
  }

  async clear() {
    await knex('users').del().where({ email: this.#user.email });
  }
}

class SutCustomer {
  #customer;

  constructor(customer) {
    this.#customer = Object.assign({}, customer);
  }

  async create() {
    const [data] = await knex('customers')
      .insert({
        id: uuidv4(),
        name: this.#customer.name,
        email: this.#customer.email,
        cpf: this.#customer.cpf,
        phone: this.#customer.phone,
        address_id: null,
      })
      .returning(['id', 'name', 'email', 'cpf', 'phone', "address_id"]);

    return data;
  }

  async clear() {
    await knex('customers').del().where({ email: this.#customer.email });
  }
}

class SutBilling {
  #billing;

  constructor(billing) {
    this.#billing = Object.assign({}, billing);
  }

  async create() {
    const [data] = await knex('billings')
      .insert({
        id: uuidv4(),
        customer_id: this.#billing.customer_id,
        description: this.#billing.description,
        status: this.#billing.status,
        value: this.#billing.value,
        due: this.#billing.due,
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
    await knex('billings')
      .del()
      .where({ customer_id: this.#billing.customer_id });
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
