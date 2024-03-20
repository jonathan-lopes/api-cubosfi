const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/server');
const { SutUser } = require('./helpers/utils');
const login = require('./helpers/login');
const { createRandomUser } = require('./helpers/randomData');
const knex = require('../src/database');

let token = '';

describe('Middleware verify login', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  it('should return status code 401 (unauthorized) if token is not sent', async () => {
    const response = await request(app).get('/user');

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('status', 401);
    expect(response.body).toHaveProperty('type', 'UnauthorizedError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty('message.error', 'Não autorizado');
  });

  it('should not be able to authenticate with a malformed token', async () => {
    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${`aaa${token}`}`);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message.error', 'Token malformado');
    expect(response.body).toHaveProperty('status', 401);
    expect(response.body).toHaveProperty('type', 'UnauthorizedError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should not be able to authenticate with a expired token', async () => {
    const sut = new SutUser(createRandomUser());
    const { id } = await sut.create();

    const token = jwt.sign({ id }, process.env.SECRET_TOKEN, {
      expiresIn: '0s',
    });

    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message.error', 'Token expirou');
    expect(response.body).toHaveProperty('status', 401);
    expect(response.body).toHaveProperty('type', 'UnauthorizedError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should not be able to authenticate if user does not exist', async () => {
    const token = jwt.sign(
      { id: '2772fcbc-07e4-4c9d-bb45-d7303832b102' },
      process.env.SECRET_TOKEN,
    );

    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty(
      'message.error',
      'Usuário não encontrado',
    );
    expect(response.body).toHaveProperty('status', 404);
    expect(response.body).toHaveProperty('type', 'NotFoundError');
    expect(response.body).toHaveProperty('dateTime');
  });
});

describe('Middleware allowed methods', () => {
  it('should return a status 405 (Method Not Allowed) if the route does not support the method', async () => {
    const response = await request(app).get('/refresh-token');

    expect(response.statusCode).toBe(405);
    expect(response.headers).toHaveProperty('allow', 'POST');

    expect(response.body).toHaveProperty('type', 'MethodNotImplementedError');
    expect(response.body).toHaveProperty('status', 405);
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty(
      'message.error',
      'Método não é suportado',
    );
  });
});

describe('Middleware Pagination', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should return custom x-pagination header', async () => {
    const response = await request(app)
      .get('/customers')
      .set('Authorization', `Bearer ${token}`);

    const pagination = JSON.parse(response.get('x-pagination'));

    expect(pagination).toBeTruthy();
    expect(pagination).toHaveProperty('total_pages');
    expect(pagination).toHaveProperty('total_records');
    expect(pagination).toHaveProperty('current_page');
    expect(pagination).toHaveProperty('prev_page');
    expect(pagination).toHaveProperty('next_page');
  });

  it('should return a badrequest if a page outside the maximum range is requested', async () => {
    const response = await request(app)
      .get('/customers')
      .query({ page: 1000 })
      .set('Authorization', `Bearer ${token}`);

    const pagination = JSON.parse(response.get('x-pagination'));

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'BadRequestError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty(
      'message.error',
      `Página solicitada fora está fora do intervalo, número de páginas máximo é ${pagination.total_pages}`,
    );
  });
});
