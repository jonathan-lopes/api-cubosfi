const request = require('supertest');
const app = require('../src/server');
const login = require('./helpers/login');
const { SutBilling, SutCustomer } = require('./helpers/utils');

let sutBilling = null;
const customer = new SutCustomer(
  'customer',
  'customer@email.com',
  '999.999.999-99',
  '(99) 99999-9999',
);
let id_customer = 1;
let token = '';

describe('Endpoint Billings', () => {
  describe('Create Billing', () => {
    beforeAll(async () => {
      token = await login(app, 'login', {
        name: 'testman#4',
        email: 'testman#4@email.com',
        password: 'testman1234',
      });

      const { id } = await customer.create();
      id_customer = id;
    });

    beforeEach(async () => {
      sutBilling = new SutBilling(
        id_customer,
        'Lorem ipsum ullamcorper taciti, inceptos.',
        'paid',
        5000,
        '2022-08-05',
      );
    });

    afterEach(() => sutBilling.clear());

    it('should return status 400 if no customer_id, description, status, value, and due are sent in the request body', async () => {
      const response = await request(app)
        .post('/billing')
        .send({})
        .set('Authorization', `Bearer ${token}`);

      expect(response.body).toHaveProperty(
        'message',
        'due é um campo obrigatório',
      );
      expect(response.statusCode).toBe(400);
    });

    it('should return status 201 if a billing has been registered', async () => {
      const dataBilling = await sutBilling.create();
      const response = await request(app)
        .post('/billing')
        .send(dataBilling)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(201);
    });
  });

  describe('List All', () => {
    it('should return all registered billings', async () => {
      const dataBilling = await sutBilling.create();
      const response = await request(app)
        .post('/billing')
        .send(dataBilling)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(201);

      const allBillings = await request(app)
        .get('/billings')
        .set('Authorization', `Bearer ${token}`);

      await customer.clear();
      expect(allBillings.statusCode).toBe(200);
      expect(allBillings.body).toHaveLength(2);
    });
  });

  describe('Delete Billing', () => {
    it('should return 404 if the charge does not exist', async () => {
      const response = await request(app)
        .del('/billing/100')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Cobrança não encontrada',
      );
    });

    it('should return status 400 if the charge is paid or overdue', async () => {
      const { id: id1 } = await sutBilling.create();

      const response1 = await request(app)
        .del(`/billing/${id1}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response1.statusCode).toBe(400);
      expect(response1.body).toHaveProperty(
        'message',
        'Esta cobrança não pode ser excluída!',
      );

      const sutBilling2 = new SutBilling(
        1,
        'lorem lorem lorem',
        'pending',
        4000,
        '2020-04-25',
      );

      const { id: id2 } = await sutBilling2.create();

      const response2 = await request(app)
        .del(`/billing/${id2}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response2.statusCode).toBe(400);
      expect(response2.body).toHaveProperty(
        'message',
        'Esta cobrança não pode ser excluída!',
      );
    });

    it('should be possible to delete a charge that is pending', async () => {
      const date = new Date();
      const sutBilling = new SutBilling(
        id_customer,
        'lorem lorem lorem',
        'pending',
        4000,
        `${date.getFullYear() + 1}-${date.getMonth()}-${date.getDate()}`,
      );

      const { id } = await sutBilling.create();
      const response = await request(app)
        .del(`/billing/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(204);
    });
  });

  describe('Get One Billing', () => {
    it('should return status 404 if billing does not exist', async () => {
      const response = await request(app)
        .get('/billing/100')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Cobrança não encontrada',
      );
    });

    it('should return billing', async () => {
      const { id } = await sutBilling.create();

      const response = await request(app)
        .get(`/billing/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('Update Billing', () => {
    it('should return status 404 if billing does not exist', async () => {
      const response = await request(app)
        .put('/billing/100')
        .send({
          description: 'lorem',
          status: 'paid',
          value: 5000,
          due: '2022-10-10',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Cobrança não encontrada',
      );
    });

    it('should return status 400 if description, status, value and expiration are not sent in the body', async () => {
      const { id } = await sutBilling.create();
      const response = await request(app)
        .put(`/billing/${id}`)
        .send({})
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'due é um campo obrigatório',
      );
    });

    it('should be possible to update a billing', async () => {
      const { id } = await sutBilling.create();

      const response = await request(app)
        .put(`/billing/${id}`)
        .send({
          description: 'lorem',
          status: 'paid',
          value: 5000,
          due: '2022-10-10',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(204);
    });
  });
});
