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

describe('List Billings Based on "is_overdue" Query Parameter', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should be possible to filter billings that are not due', async () => {
    const customer = new SutCustomer(createRandomCustomer());
    const { id } = await customer.create();

    const randomBill = createRandomBilling(
      `${new Date().getFullYear() + 1}-06-23`,
      'pending',
    );

    await new SutBilling({
      customer_id: id,
      ...randomBill,
    }).create();

    const response = await request(app)
      .get('/billings')
      .query({ is_overdue: false })
      .set('Authorization', `Bearer ${token}`);

    const billing = await knex('billings').where({ is_overdue: 0 }).first();

    expect(response.statusCode).toBe(200);
    expect(billing).toHaveProperty('is_overdue', 0);
  });

  it('should be possible to filter billings that are due', async () => {
    const customer = new SutCustomer(createRandomCustomer());
    const { id } = await customer.create();

    const randomBill = createRandomBilling(`2020-10-13`, 'pending');

    const { id: billingID } = await new SutBilling({
      customer_id: id,
      ...randomBill,
    }).create();

    const response = await request(app)
      .get('/billings')
      .query({ is_overdue: true })
      .set('Authorization', `Bearer ${token}`);

    const [billing] = await knex('billings')
      .update({ is_overdue: 1 })
      .where({ id: billingID })
      .returning('*');

    expect(response.statusCode).toBe(200);
    expect(billing).toHaveProperty('is_overdue', 1);
  });

  it('should fail if a value other than boolean is passed', async () => {
    const response = await request(app)
      .get('/billings')
      .query({ is_overdue: 'anything' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty(
      'message.query.is_overdue',
      'query.is_overdue deve ser do tipo `boolean`, mas o valor final foi: `"anything"`.',
    );
  });
});
