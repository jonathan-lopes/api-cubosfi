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
const { isAfter } = require('date-fns');

let token = '';

describe('List Billings Based on "after_due_date" Query Parameter', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should be possible to filter for billings after a certain due date', async () => {
    const customer = new SutCustomer(createRandomCustomer());
    const { id } = await customer.create();

    const randomBill = createRandomBilling('2022-02-04');

    await new SutBilling({
      customer_id: id,
      ...randomBill,
    }).create();

    const response = await request(app)
      .get('/billings')
      .query({ after_due_date: '2022-01-01' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toHaveProperty('due');
    expect(isAfter(response.body[0].due, '2021-02-04')).toBeTruthy();
  });

  it('should fail if a date outside the format yyyy-mm-dd is passed', async () => {
    const response = await request(app)
      .get('/billings')
      .query({ after_due_date: '10-10-2021' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty(
      'message.query.after_due_date',
      'data inválida, formato deve ser yyyy-dd-mm',
    );
  });
});
