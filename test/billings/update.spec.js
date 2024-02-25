const request = require('supertest');
const app = require('../../src/server');
const login = require('../helpers/login');
const {
  createRandomUser,
  createRandomBilling,
  createRandomCustomer,
} = require('../helpers/randomData');
const { SutBilling, SutCustomer } = require('../helpers/utils');
const knex = require('../../src/database');

const customer = new SutCustomer(createRandomCustomer());

let customerID = '';
let token = '';

describe('Update Billing', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
    const { id } = await customer.create();
    customerID = id;
  });

  afterAll(async () => await knex.destroy());

  it('should return status 404 if billing does not exist', async () => {
    const response = await request(app)
      .put('/billings/1c53ae80-5042-4db9-aad5-3e2d510c98b3')
      .send(createRandomBilling('2022-10-10'))
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('status', 404);
    expect(response.body).toHaveProperty('type', 'NotFoundError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty(
      'message.error',
      'Cobrança não encontrada',
    );
  });

  it('should return status 400 if description, status, value and due are not sent in the body', async () => {
    const randomBill = createRandomBilling('2023-01-05');
    const sutBilling = new SutBilling({
      customer_id: customerID,
      ...randomBill,
    });

    const { id } = await sutBilling.create();

    const response = await request(app)
      .put(`/billings/${id}`)
      .send({})
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty('message.due', 'due é obrigatório');
    expect(response.body).toHaveProperty(
      'message.description',
      'description é obrigatório',
    );
    expect(response.body).toHaveProperty(
      'message.status',
      'status é obrigatório',
    );
    expect(response.body).toHaveProperty(
      'message.value',
      'value é obrigatório',
    );
  });

  it('should be possible to update a billing', async () => {
    const randomBill = createRandomBilling('2022-08-30', 'pending');
    const sutBilling = new SutBilling({
      customer_id: customerID,
      ...randomBill,
    });

    const { id } = await sutBilling.create();

    const response = await request(app)
      .put(`/billings/${id}`)
      .send(createRandomBilling('2022-10-10'))
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });
});
