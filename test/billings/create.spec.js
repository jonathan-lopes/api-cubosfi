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

let token = '';

describe('Create Billing', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should return status 400 if no customer_id, description, status, value, and due are sent in the request body', async () => {
    const response = await request(app)
      .post('/billings')
      .send({})
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty('message.due', 'due é obrigatório');
    expect(response.body).toHaveProperty(
      'message.customer_id',
      'customer_id é obrigatório',
    );
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

  it('should return status 201 if a billing has been registered', async () => {
    const { id: customerID } = await new SutCustomer(
      createRandomCustomer(),
    ).create();

    const bill = createRandomBilling('2022-10-15');

    const sutBilling = new SutBilling({
      customer_id: customerID,
      ...bill,
    });

    const dataBilling = await sutBilling.create();

    const response = await request(app)
      .post('/billings')
      .send(dataBilling)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
  });
});
