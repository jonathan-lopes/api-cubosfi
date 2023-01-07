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
let id_customer = '';
let token = '';

describe('Billings Endpoint', () => {
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

  describe('Create Billing', () => {
    it('should return status 400 if no customer_id, description, status, value, and due are sent in the request body', async () => {
      const response = await request(app)
        .post('/billings')
        .send({})
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('status', 400);
      expect(response.body).toHaveProperty('type', 'ValidationError');
      expect(response.body).toHaveProperty('dateTime');
      expect(response.body).toHaveProperty(
        'message.due',
        'due é um campo obrigatório',
      );
      expect(response.body).toHaveProperty(
        'message.customer_id',
        'customer_id é um campo obrigatório',
      );
      expect(response.body).toHaveProperty(
        'message.description',
        'description é um campo obrigatório',
      );
      expect(response.body).toHaveProperty(
        'message.status',
        'status é um campo obrigatório',
      );
      expect(response.body).toHaveProperty(
        'message.value',
        'value é um campo obrigatório',
      );
    });

    it('should return status 201 if a billing has been registered', async () => {
      const dataBilling = await sutBilling.create();
      const response = await request(app)
        .post('/billings')
        .send(dataBilling)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(201);
    });
  });

  describe('List All', () => {
    it('should return all registered billings', async () => {
      const dataBilling = await sutBilling.create();
      const response = await request(app)
        .post('/billings')
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

    it('should return status 400 if the bill is paid', async () => {
      const { id } = await sutBilling.create();

      const response = await request(app)
        .del(`/billings/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(
        'message.error',
        'Esta cobrança não pode ser excluída!',
      );
      expect(response.body).toHaveProperty('status', 400);
      expect(response.body).toHaveProperty('type', 'BadRequestError');
      expect(response.body).toHaveProperty('dateTime');
    });

    it('should return status 400 if the bill is overdue', async () => {
      const sutBilling = new SutBilling(
        id_customer,
        'lorem lorem lorem',
        'pending',
        4000,
        '2020-04-25',
      );

      const { id } = await sutBilling.create();

      const response = await request(app)
        .del(`/billings/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('status', 400);
      expect(response.body).toHaveProperty('type', 'BadRequestError');
      expect(response.body).toHaveProperty('dateTime');
      expect(response.body).toHaveProperty(
        'message.error',
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
        `${date.getFullYear() + 1}-10-${date.getDate()}`,
      );

      const { id } = await sutBilling.create();
      const response = await request(app)
        .del(`/billings/${id}`)
        .set('Authorization', `Bearer ${token}`);

      console.log(response.body);

      expect(response.statusCode).toBe(204);
    });
  });

  describe('Get One Billing', () => {
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
      const { id } = await sutBilling.create();

      const response = await request(app)
        .get(`/billings/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('Update Billing', () => {
    it('should return status 404 if billing does not exist', async () => {
      const response = await request(app)
        .put('/billings/1c53ae80-5042-4db9-aad5-3e2d510c98b3')
        .send({
          description: 'lorem',
          status: 'paid',
          value: 5000,
          due: '2022-10-10',
        })
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

    it('should return status 400 if description, status, value and due are not sent in the body', async () => {
      const { id } = await sutBilling.create();

      const response = await request(app)
        .put(`/billings/${id}`)
        .send({})
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('status', 400);
      expect(response.body).toHaveProperty('type', 'ValidationError');
      expect(response.body).toHaveProperty('dateTime');
      expect(response.body).toHaveProperty(
        'message.due',
        'due é um campo obrigatório',
      );
      expect(response.body).toHaveProperty(
        'message.description',
        'description é um campo obrigatório',
      );
      expect(response.body).toHaveProperty(
        'message.status',
        'status é um campo obrigatório',
      );
      expect(response.body).toHaveProperty(
        'message.value',
        'value é um campo obrigatório',
      );
    });

    it('should be possible to update a billing', async () => {
      const { id } = await sutBilling.create();

      const response = await request(app)
        .put(`/billings/${id}`)
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
