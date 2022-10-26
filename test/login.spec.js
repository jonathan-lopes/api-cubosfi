const request = require('supertest');
const app = require('../src/server');
const { clear, createSut } = require('./helpers/utils');

describe('Enpoint login', () => {
  afterEach(async () => clear());

  it('should fail if not send body email and password', async () => {
    const { email, password } = await createSut();

    const responseEmail = await request(app).post('/login').send({
      email,
    });

    expect(responseEmail.status).toBe(400);
    expect(responseEmail.body).toHaveProperty(
      'message',
      'password é um campo obrigatório',
    );

    const responsePasswd = await request(app).post('/login').send({
      password,
    });

    expect(responsePasswd.status).toBe(400);
    expect(responsePasswd.body).toHaveProperty(
      'message',
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
      'message',
      'E-mail ou senha inválidos',
    );
  });

  it('should fail if password is incorrect', async () => {
    const { email } = await createSut();

    const response = await request(app).post('/login').send({
      email,
      password: 'test123456',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'E-mail ou senha inválidos',
    );
  });

  it('should returning user with token', async () => {
    const { email, password } = await createSut();

    const response = await request(app).post('/login').send({
      email,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });
});
