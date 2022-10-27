const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/server');
const { createSut, clear } = require('./helpers/utils');

describe('Middleware verify login', () => {
  afterEach(async () => clear());

  it('should return status code 401 (unauthorized) if token is not sent', async () => {
    await createSut();

    const response = await request(app).get('/user');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Não autorizado');
  });

  it('should not be able to authenticate with a malformed token', async () => {
    const { email, password } = await createSut();
    const responseLogin = await request(app)
      .post('/login')
      .send({ email, password });

    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${`aaa${responseLogin.body.token}`}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Token malformado');
  });

  it('should not be able to authenticate with a expired token', async () => {
    const { id } = await createSut();
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
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
      }, 4000);
    }
    timer();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 4000);
  });

  it('should not be able to authenticate if user does not exist', async () => {
    const token = jwt.sign({ id: 1000 }, process.env.JWT_SECRET);

    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
  });
});
