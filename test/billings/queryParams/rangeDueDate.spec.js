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

describe('List billings based on a range of due dates', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

  it('should be possible to filter billings by a date range', async () => {
    const customer = new SutCustomer(createRandomCustomer());
    const { id } = await customer.create();

    const randomBills = [];

    for (let i = 0; i < 2; i++) {
      const bill = createRandomBilling(`202${i + 1}-02-28`);

      randomBills.push(bill);

      new SutBilling({
        customer_id: id,
        ...bill,
      }).create();
    }

    const response = await request(app)
      .get('/billings')
      .query({
        due_date_start: randomBills[0].due,
        due_date_end: randomBills[1].due,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  it('should fail if the date outside the yyyy-mm-dd format is passed to the due_date_start query parameter', async () => {
    const response = await request(app)
      .get('/billings')
      .query({ due_date_start: '05/05/2011' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty(
      'message.query.due_date_start',
      'data inválida, formato deve ser yyyy-dd-mm',
    );
  });

  it('should fail if the date outside the yyyy-mm-dd format is passed to the due_date_end query parameter', async () => {
    const response = await request(app)
      .get('/billings')
      .query({ due_date_end: '2009-31-10' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty(
      'message.query.due_date_end',
      'data inválida, formato deve ser yyyy-dd-mm',
    );
  });
});
