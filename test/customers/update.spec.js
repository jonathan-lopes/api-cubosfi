const login = require('../helpers/login');
const request = require('supertest');
const app = require('../../src/server');
const {
  createRandomUser,
  createRandomCustomer,
} = require('../helpers/randomData');
const { SutCustomer } = require('../helpers/utils');
const knex = require('../../src/database');

let token = '';

describe('Update Customer', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should return status 409 if the email has already been registered', async () => {
    const customerWithConflict = new SutCustomer(createRandomCustomer());
    const randomCustomer = new SutCustomer(createRandomCustomer());

    const { email } = await randomCustomer.create();
    const { id } = await customerWithConflict.create();

    const response = await request(app)
      .put(`/customers/${id}`)
      .send({
        ...createRandomCustomer(),
        email,
      })
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
    const customerWithConflict = new SutCustomer(createRandomCustomer());
    const randomCustomer = new SutCustomer(createRandomCustomer());

    const { address_id: _, ...dataCustomer } =
      await customerWithConflict.create();
    const { cpf } = await randomCustomer.create();

    const body = {
      ...dataCustomer,
      cpf,
    };

    const response = await request(app)
      .put(`/customers/${dataCustomer.id}`)
      .send(body)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('message.error', 'CPF já cadastrado');
    expect(response.body).toHaveProperty('status', 409);
    expect(response.body).toHaveProperty('type', 'ConflictError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should return status 400 if the uuid is invalid', async () => {
    const response = await request(app)
      .put('/customers/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'BadRequestError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty(
      'message.error',
      'Id de cliente inválido',
    );
  });

  it('should be possible to update a client', async () => {
    const randomCustomer = new SutCustomer(createRandomCustomer());
    const customer = await randomCustomer.create();

    const response = await request(app)
      .put(`/customers/${customer.id}`)
      .send(createRandomCustomer())
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });

  it('should be possible to update customer data with registered address', async () => {
    const customer = await new SutCustomer(createRandomCustomer()).create();

    const address = {
      street: 'Praça da Sé',
      cep: '01001-000',
      complement: 'lado ímpar',
      district: 'Sé',
      city: 'São Paulo',
      uf: 'SP',
    };

    const dataWithAddress = {
      ...customer,
      address,
    };

    await request(app)
      .put(`/customers/${customer.id}`)
      .send(dataWithAddress)
      .set('Authorization', `Bearer ${token}`);

    const dataForUpdate = {
      ...customer,
      address: {
        street: 'Avenida Rangel Pestana',
        cep: '03001-000',
        complement: 'de 501 ao fim - lado ímpar',
        district: 'Brás',
        city: 'São Paulo',
        uf: 'SP',
      },
    };

    const response = await request(app)
      .put(`/customers/${customer.id}`)
      .send(dataForUpdate)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });

  it('should be possible to update a customer and register an address', async () => {
    const customer = await new SutCustomer(createRandomCustomer()).create();

    const data = {
      ...customer,
      address: {
        cep: '02001-000',
        street: 'Parque Anhembi',
        district: 'Santana',
        city: 'São Paulo',
        uf: 'SP',
      },
    };

    const response = await request(app)
      .put(`/customers/${customer.id}`)
      .send(data)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });
});
