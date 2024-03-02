const request = require('supertest');
const app = require('../../../src/server');
const login = require('../../helpers/login');
const { SutCustomer, SutBilling } = require('../../helpers/utils');
const {
  createRandomCustomer,
  createRandomBilling,
  createRandomUser,
} = require('../../helpers/randomData');
const knex = require('../../../src/database');

let token = '';

describe('List Billings Based on "status" Query Parameter', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should be possible to filter billings by pending status', async () => {
    const customer = new SutCustomer(createRandomCustomer());
    const { id } = await customer.create();

    const randomBill = createRandomBilling(
      `${new Date().getFullYear() + 1}-01-05`,
      'pending',
    );

    await new SutBilling({
      customer_id: id,
      ...randomBill,
    }).create();

    const response = await request(app)
      .get('/billings')
      .query({ status: 'pending' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toHaveProperty('status', 'pending');
  });

  it('should be possible to filter billings by paid status', async () => {
    const customer = new SutCustomer(createRandomCustomer());
    const { id } = await customer.create();

    const randomBill = createRandomBilling(`2020-06-23`);

    await new SutBilling({
      customer_id: id,
      ...randomBill,
    }).create();

    const response = await request(app)
      .get('/billings')
      .query({ status: 'paid' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toHaveProperty('status', 'paid');
  });

  it('should fail if past an amount other than paid or pending for the filter', async () => {
    const response = await request(app)
      .get('/billings')
      .query({ status: 'anything' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty(
      'message.query.status',
      'status devem ser paid ou pending',
    );
  });
});
