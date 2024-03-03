const request = require('supertest');
const app = require('../src/server');
const { SutUser } = require('./helpers/utils');
const { createRandomUser } = require('./helpers/randomData');
const knex = require('../src/database');

describe('Login Enpoint', () => {
  afterAll(async () => await knex.destroy());

  it('should fail if not send body email and password', async () => {
    const response = await request(app).post('/login').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty(
      'message.password',
      'password é obrigatório',
    );
    expect(response.body).toHaveProperty(
      'message.email',
      'email é obrigatório',
    );
  });

  it('should fail if email not exist', async () => {
    const response = await request(app).post('/login').send(createRandomUser());

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'message.error',
      'E-mail ou senha inválidos',
    );
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'BadRequestError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should fail if password is incorrect', async () => {
    const user = new SutUser(createRandomUser());

    const { email } = await user.create();

    const response = await request(app).post('/login').send({
      email,
      password: 'test123456',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'message.error',
      'E-mail ou senha inválidos',
    );
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'BadRequestError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should returning user with token and refresh token', async () => {
    const user = new SutUser(createRandomUser());

    const { email, password } = await user.create();

    const response = await request(app).post('/login').send({
      email,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refresh_token');
    expect(response.body).toHaveProperty('user');
  });
});
