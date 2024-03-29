const login = require('../../helpers/login');
const request = require('supertest');
const app = require('../../../src/server');
const {
  createRandomUser,
  createRandomCustomer,
} = require('../../helpers/randomData');
const knex = require('../../../src/database');
const { SutCustomer } = require('../../helpers/utils');

let token = '';

describe('List Customers Based on "page_size" Query Parameter', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should return a maximum of 20 clients if page_size is not sent in the query parameter', async () => {
    await new SutCustomer(createRandomCustomer()).create();

    const response = await request(app)
      .get('/customers')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(20);
  });

  it('should return customers with a page_size of 2', async () => {
    await new SutCustomer(createRandomCustomer()).create();

    const page_size = 2;

    const response = await request(app)
      .get('/customers')
      .query({ page_size })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(page_size);
  });

  it('should fail if page_size is not a positive integer', async () => {
    const response = await request(app)
      .get('/customers')
      .query({ page_size: 'foo' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty(
      'message.query.page_size',
      'page_size deve ser do tipo number',
    );
  });
});
