const login = require('../helpers/login');
const request = require('supertest');
const app = require('../../src/server');
const { createRandomUser } = require('../helpers/randomData');
const knex = require('../../src/database');

let token = '';

describe('Get All Customer', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should return all customers', async () => {
    const allCustomers = request(app)
      .get('/customers')
      .set('Authorization', `Bearer ${token}`);

    const query = knex('customers').count({ count: '*' }).first();

    const [response, { count }] = await Promise.all([allCustomers, query]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(count);
  });
});
