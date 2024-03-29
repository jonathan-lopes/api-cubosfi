const request = require('supertest');
const app = require('../../src/server');
const login = require('../helpers/login');
const {
  createRandomUser,
  createRandomCustomer,
} = require('../helpers/randomData');
const { SutCustomer } = require('../helpers/utils');
const knex = require('../../src/database');

let token = '';

describe('Create Customer', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should return status 400 if name, email, cpf and phone fields are not sent', async () => {
    const response = await request(app)
      .post('/customers')
      .send({})
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty(
      'message.phone',
      'phone é obrigatório',
    );
    expect(response.body).toHaveProperty(
      'message.email',
      'email é obrigatório',
    );
    expect(response.body).toHaveProperty('message.name', 'name é obrigatório');
  });

  it('should return status 409 if the email has already been registered', async () => {
    const customer = new SutCustomer(createRandomCustomer());
    const { email } = await customer.create();
    const data = { ...createRandomCustomer(), email };

    const response = await request(app)
      .post('/customers')
      .send(data)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty(
      'message.error',
      'E-mail já cadastrado',
    );
    expect(response.body).toHaveProperty('status', 409);
    expect(response.body).toHaveProperty('type', 'ConflictError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should return status 409 if the cpf has already been registered', async () => {
    const customer = new SutCustomer(createRandomCustomer());
    const { cpf } = await customer.create();

    const data = { ...createRandomCustomer(), cpf };

    const response = await request(app)
      .post('/customers')
      .send(data)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('message.error', 'CPF já cadastrado');
    expect(response.body).toHaveProperty('status', 409);
    expect(response.body).toHaveProperty('type', 'ConflictError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should be possible to create a customer without the address', async () => {
    const data = createRandomCustomer();

    const response = await request(app)
      .post('/customers')
      .send(data)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
  });

  it('should be possible to create a customer with address', async () => {
    const data = {
      ...createRandomCustomer(),
      address: {
        street: 'Largo do Farol da Barra',
        cep: '40140-650',
        district: 'Barra',
        city: 'Salvador',
        uf: 'BA',
      },
    };

    const response = await request(app)
      .post('/customers')
      .send(data)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
  });
});
