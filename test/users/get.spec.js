const request = require('supertest');
const app = require('../../src/server');
const login = require('../helpers/login');
const { createRandomUser } = require('../helpers/randomData');
const knex = require('../../src/database');

let token = '';

describe('Get User', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should not return user data if not authenticated', async () => {
    const response = await request(app).get('/user');

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('status', 401);
    expect(response.body).toHaveProperty('type', 'UnauthorizedError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty('message.error', 'Não autorizado');
  });

  it('should return user data', async () => {
    const data = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`);

    expect(data.statusCode).toBe(200);
    expect(data.body).toHaveProperty('id');
    expect(data.body).toHaveProperty('email');
    expect(data.body).toHaveProperty('name');
    expect(data.body).toHaveProperty('cpf');
    expect(data.body).toHaveProperty('phone');
  });
});
