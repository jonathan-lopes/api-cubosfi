const login = require('../helpers/login');
const request = require('supertest');
const app = require('../../src/server');
const {
  createRandomUser,
  createRandomCustomer,
} = require('../helpers/randomData');
const { SutCustomer } = require('../helpers/utils');

describe('Get One Customer', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser(), 'login');
  });

  it('should return status 400 if a customer does not exist', async () => {
    const response = await request(app)
      .get('/customers/a334d00d-07bc-4c38-a909-bae7328e60e9')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty(
      'message.error',
      'Cliente não encontrado',
    );
    expect(response.body).toHaveProperty('status', 404);
    expect(response.body).toHaveProperty('type', 'NotFoundError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should return a customer', async () => {
    const randomCustomer = new SutCustomer(createRandomCustomer());

    const { id } = await randomCustomer.create();

    const response = await request(app)
      .get(`/customers/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });
});
