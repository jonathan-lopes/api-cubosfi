const request = require('supertest');
const app = require('../src/server');
const { SutUser } = require('./helpers/utils');

const sut = new SutUser('testman#1', 'testman#1@email.com', 'testman1234');

describe('Login Enpoint', () => {
  afterEach(() => sut.clear());

  it('should fail if not send body email and password', async () => {
    const response = await request(app).post('/login').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty(
      'message.password',
      'password é um campo obrigatório',
    );
    expect(response.body).toHaveProperty(
      'message.email',
      'email é um campo obrigatório',
    );
  });

  it('should fail if email not exist', async () => {
    const response = await request(app).post('/login').send({
      email: 'jonhTest@email.com',
      password: 'jonh1234',
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

  it('should fail if password is incorrect', async () => {
    const { email } = await sut.create();

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
    const { email, password } = await sut.create();

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
