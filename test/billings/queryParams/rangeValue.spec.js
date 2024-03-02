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

describe('List billings based on a range of values', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should be possible to filter charges by a range of values', async () => {
    const customer = new SutCustomer(createRandomCustomer());
    const { id } = await customer.create();

    const randomBills = [];

    for (let i = 0; i < 2; i++) {
      const bill = createRandomBilling('2023-02-28');
      bill.value = 1000 * (i + 1);

      randomBills.push(bill);

       new SutBilling({
        customer_id: id,
        ...bill,
      }).create();
    }

    const response = await request(app)
      .get('/billings')
      .query({
        value_start: randomBills[0].value,
        value_end: randomBills[1].value,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body[0].value).toBeGreaterThanOrEqual(randomBills[0].value);
  });

  it('should fail if the value passed to the value start parameter is not a positive integer', async () => {
    const response = await request(app)
      .get('/billings')
      .query({ value_start: 100.5 })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty(
      'message.query.value_start',
      'query.value_start deve ser um número inteiro',
    );
  });

  it('should fail if the value passed to the value_end parameter is not a positive integer', async () => {
    const response = await request(app)
      .get('/billings')
      .query({ value_end: 50.60 })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty(
      'message.query.value_end',
      'query.value_end deve ser um número inteiro',
    );
  });
});
