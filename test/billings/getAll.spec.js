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
    const { count } = await knex('billings').count({ count: '*' }).first();

    const allBillings = await request(app)
      .get('/billings')
      .set('Authorization', `Bearer ${token}`);

    expect(allBillings.statusCode).toBe(200);
    expect(allBillings.body).toHaveLength(count);
  });
});
