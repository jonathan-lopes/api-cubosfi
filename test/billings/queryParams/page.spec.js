const login = require('../../helpers/login');
const request = require('supertest');
const app = require('../../../src/server');
const { createRandomUser } = require('../../helpers/randomData');
const knex = require('../../../src/database');

let token = '';

describe('List Billings Based on "page" Query Parameter', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should return the first billings page if page is not sent in the query parameter', async () => {
    const response = await request(app)
      .get('/billings')
      .set('Authorization', `Bearer ${token}`);

    const pagination = JSON.parse(response.get('x-pagination'));

    expect(response.statusCode).toBe(200);
    expect(pagination.current_page).toBe(1);
  });

  it('should return billings on page 1', async () => {
    const response = await request(app)
      .get('/billings')
      .set('Authorization', `Bearer ${token}`);

    const pagination = JSON.parse(response.get('x-pagination'));

    expect(response.statusCode).toBe(200);
    expect(pagination.current_page).toBe(1);
  });

  it('should fail if page is not a positive integer', async () => {
    const response = await request(app)
      .get('/billings')
      .query({ page: 'foobar' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty(
      'message.query.page',
      'page deve ser do tipo number',
    );
  });
});
