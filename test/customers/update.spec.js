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

const randomCustomer = new SutCustomer(createRandomCustomer());

describe('Update Customer', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterEach(() => randomCustomer.clear());

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

  it('should be possible to update a client', async () => {
    const customer = await randomCustomer.create();

    const response = await request(app)
      .put(`/customers/${customer.id}`)
      .send({
        ...customer,
        name: 'Anny Mary Smith',
        cpf: '07484496589',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });
});
