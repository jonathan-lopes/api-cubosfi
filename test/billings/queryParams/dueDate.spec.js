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

describe('List Billings Based on "due_date" Query Parameter', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should be possible to filter by due date', async () => {
    const customer = new SutCustomer(createRandomCustomer());
    const { id } = await customer.create();

    const date = '2020-10-04';

    const randomBill = createRandomBilling(date);

    await new SutBilling({
      customer_id: id,
      ...randomBill,
    }).create();

    const response = await request(app)
      .get('/billings')
      .query({ due_date: date })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toHaveProperty('due', date);
  });

  it('should fail if a date outside the format yyyy-mm-dd is passed', async () => {
    const response = await request(app)
      .get('/billings')
      .query({ due_date: '10-10-2021' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty(
      'message.query.due_date',
      'data inválida, formato deve ser yyyy-dd-mm',
    );
  });
});
