const request = require('supertest');
const knex = require('../../src/database');
const app = require('../../src/server');
const login = require('../helpers/login');
const { createRandomUser } = require('../helpers/randomData');

let token = '';

describe('List All Billings', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should return all registered billings', async () => {
    const allBillings = request(app)
      .get('/billings')
      .set('Authorization', `Bearer ${token}`);

    const query = knex('billings').count({ count: '*' }).first();

    const [response, { count }] = await Promise.all([allBillings, query]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(count);
  });
});
