const request = require('supertest');
const app = require('../src/server');
const { SutUser } = require('./helpers/utils');

const sut = new SutUser('testman#1', 'testman#1@email.com', 'testman1234');

describe('Enpoint login', () => {
  afterEach(() => sut.clear());

  it('should fail if not send body email and password', async () => {
    const { email, password } = await sut.create();

    const responseEmail = await request(app).post('/login').send({
      email,
    });

    expect(responseEmail.status).toBe(400);
    expect(responseEmail.body).toHaveProperty(
      'message',
      'password é um campo obrigatório',
    );
    expect(responseEmail.body).toHaveProperty('status', 400);
    expect(responseEmail.body).toHaveProperty('type', 'ValidationError');
    expect(responseEmail.body).toHaveProperty('dateTime');

    const responsePasswd = await request(app).post('/login').send({
      password,
    });

    expect(responsePasswd.status).toBe(400);
    expect(responsePasswd.body).toHaveProperty(
      'message',
      'email é um campo obrigatório',
    );
    expect(responsePasswd.body).toHaveProperty('status', 400);
    expect(responsePasswd.body).toHaveProperty('type', 'ValidationError');
    expect(responsePasswd.body).toHaveProperty('dateTime');
  });

  it('should fail if email not exist', async () => {
    const response = await request(app).post('/login').send({
      email: 'jonhTest@email.com',
      password: 'jonh1234',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
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
      'message',
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
