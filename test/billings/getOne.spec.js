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

describe('Get One Billing', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should return status 404 if billing does not exist', async () => {
    const response = await request(app)
      .get('/billings/1c53ae80-5042-4db9-aad5-3e2d510c98b3')
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

  it('should return billing', async () => {
    const { id: customerID } = await new SutCustomer(
      createRandomCustomer(),
    ).create();

    const randomBill = createRandomBilling('2022-10-15');

    const sutBilling = new SutBilling({
      customer_id: customerID,
      ...randomBill,
    });

    const dataBilling = await sutBilling.create();

    await request(app)
      .post('/billings')
      .send(dataBilling)
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get(`/billings/${dataBilling.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });
});
