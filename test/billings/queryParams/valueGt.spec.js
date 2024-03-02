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

describe('List Billings Based on "value_gt" Query Parameter', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should be possible to filter billings by the highest specified value', async () => {
    const customer = new SutCustomer(createRandomCustomer());
    const { id } = await customer.create();

    const greaterValue = 1000;

    const randomBill = createRandomBilling('2023-02-28');

    await new SutBilling({
      customer_id: id,
      ...randomBill,
    }).create();

    const response = await request(app)
      .get('/billings')
      .query({ value_gt: greaterValue })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body[0].value).toBeGreaterThan(greaterValue);
  });

  it('should fail if the value passed is not a positive integer', async () => {
    const response = await request(app)
      .get('/billings')
      .query({ value_lt: 3.141516 })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty(
      'message.query.value_lt',
      'query.value_lt deve ser um número inteiro',
    );
  });
});
