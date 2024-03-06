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

const customer = new SutCustomer(createRandomCustomer());

let customerID = '';
let token = '';

describe('Delete Billing', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
    const { id } = await customer.create();
    customerID = id;
  });

  afterAll(async () => await knex.destroy());

  it('should return 404 if the billing does not exist', async () => {
    const response = await request(app)
      .del('/billings/98a760d8-ed4f-4f4f-8b28-844485ac1c0d')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty(
      'message.error',
      'Cobrança não encontrada',
    );
    expect(response.body).toHaveProperty('status', 404);
    expect(response.body).toHaveProperty('type', 'NotFoundError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should return status 400 if the billing is paid', async () => {
    const randomBill = createRandomBilling('2020-05-24');

    const { id } = await new SutBilling({
      customer_id: customerID,
      ...randomBill,
    }).create();

    const response = await request(app)
      .del(`/billings/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty(
      'message.error',
      'Esta cobrança não pode ser excluída!',
    );
    expect(response.body).toHaveProperty('status', 403);
    expect(response.body).toHaveProperty('type', 'ForbiddenError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should return status 400 if the bill is overdue', async () => {
    const randomBill = createRandomBilling('2020-04-25', 'pending');
    const sutBilling = new SutBilling({
      customer_id: customerID,
      ...randomBill,
    });

    const { id } = await sutBilling.create();

    const response = await request(app)
      .del(`/billings/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('status', 403);
    expect(response.body).toHaveProperty('type', 'ForbiddenError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty(
      'message.error',
      'Esta cobrança não pode ser excluída!',
    );
  });

  it('should return status 400 if the uuid is invalid', async () => {
    const response = await request(app)
      .del('/billings/10')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'BadRequestError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty(
      'message.error',
      'Id da cobrança inválido',
    );
  });

  it('should be possible to delete a charge that is pending', async () => {
    const date = new Date();
    const randomBill = createRandomBilling(
      `${date.getFullYear() + 1}-10-${date.getDate()}`,
      'pending',
    );

    const sutBilling = new SutBilling({
      customer_id: customerID,
      ...randomBill,
    });

    const { id } = await sutBilling.create();
    const response = await request(app)
      .del(`/billings/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });
});
