const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/server');
const { SutUser } = require('./helpers/utils');
const login = require('./helpers/login');

let token = '';

describe('Middleware verify login', () => {
  beforeAll(async () => {
    token = await login(app, 'login', {
      name: 'testman#2',
      email: 'testman#2@email.com',
      password: 'testman1234',
    });
  });

  it('should return status code 401 (unauthorized) if token is not sent', async () => {
    const response = await request(app).get('/user');

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('status', 401);
    expect(response.body).toHaveProperty('type', 'UnauthorizedError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty('message', 'Não autorizado');
  });

  it('should not be able to authenticate with a malformed token', async () => {
    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${`aaa${token}`}`);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Token malformado');
    expect(response.body).toHaveProperty('status', 401);
    expect(response.body).toHaveProperty('type', 'UnauthorizedError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should not be able to authenticate with a expired token', async () => {
    const sut = new SutUser('Jack', 'jack@email.com', 'jack12346545');
    const { id } = await sut.create();
    const token = jwt.sign({ id }, process.env.SECRET_TOKEN, {
      expiresIn: '3s',
    });

    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    function timer() {
      setTimeout(async () => {
        const response = await request(app)
          .get('/user')
          .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Token expirou');
        expect(response.body).toHaveProperty('status', 401);
        expect(response.body).toHaveProperty('type', 'UnauthorizedError');
        expect(response.body).toHaveProperty('dateTime');
      }, 4000);
    }
    timer();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 4000);
    await sut.clear();
  });

  it('should not be able to authenticate if user does not exist', async () => {
    const token = jwt.sign({ id: '2772fcbc-07e4-4c9d-bb45-d7303832b102' }, process.env.SECRET_TOKEN);

    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
    expect(response.body).toHaveProperty('status', 404);
    expect(response.body).toHaveProperty('type', 'NotFoundError');
    expect(response.body).toHaveProperty('dateTime');
  });
});
