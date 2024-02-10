const request = require('supertest');
const knex = require('../../src/database');
const app = require('../../src/server');
const login = require('../helpers/login');
const {
  createRandomBilling,
  createRandomCustomer,
  createRandomUser,
} = require('../helpers/randomData');
const { SutBilling, SutCustomer } = require('../helpers/utils');

let token = '';

describe('List All Billings', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser(), 'login');
  });

  it('should return all registered billings', async () => {
    await knex('billings').truncate();

    const { id: customerID } = await new SutCustomer(
      createRandomCustomer(),
    ).create();

    for (let i = 0; i < 2; i++) {
      const randomBill = createRandomBilling('2021-01-05');

      const dataBilling = await new SutBilling({
        customer_id: customerID,
        ...randomBill,
      }).create();

      request(app)
        .post('/billings')
        .send(dataBilling)
        .set('Authorization', `Bearer ${token}`);
    }

    const allBillings = await request(app)
      .get('/billings')
      .set('Authorization', `Bearer ${token}`);

    expect(allBillings.statusCode).toBe(200);
    expect(allBillings.body).toHaveLength(2);
  });
});
