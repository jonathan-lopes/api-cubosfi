const login = require('./helpers/login');
const request = require('supertest');
const app = require('../src/server');
const { SutCustomer } = require('./helpers/utils');

let token = '';
const sut = new SutCustomer(
  'Anny',
  'anny@email.com',
  '480.301.580-50',
  '(96) 93498-1258',
);

describe('Endpoint Customers', () => {
  beforeAll(async () => {
    token = await login(app, 'login', {
      name: 'testman#5',
      email: 'testman#5@email.com',
      password: 'testman1234',
    });
  });

  afterEach(() => sut.clear());

  describe('Create Customer', () => {
    it('should return status 400 if name, email, cpf and phone fields are not sent', async () => {
      const response = await request(app)
        .post('/customer')
        .send({})
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'phone é um campo obrigatório',
      );
    });

    it('should return status 409 if the email has already been registered', async () => {
      await sut.create();

      const response = await request(app)
        .post('/customer')
        .send({
          name: 'Anny Mary',
          email: 'anny@email.com',
          cpf: '490.351.745-50',
          phone: '(96) 93458-1458',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('message', 'E-mail já cadastrado');
    });

    it('should return status 409 if the cpf has already been registered', async () => {
      await sut.create();

      const response = await request(app)
        .post('/customer')
        .send({
          name: 'Anny Mary',
          email: 'anny.mary@email.com',
          cpf: '480.301.580-50',
          phone: '(96) 93458-1458',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('message', 'CPF já cadastrado');
    });

    it('should be possible to create a customer without the address', async () => {
      const response = await request(app)
        .post('/customer')
        .send({
          name: 'Jonh Doe',
          email: 'jonh.doe@email.com',
          cpf: '747.795.240-91',
          phone: '(65) 92337-6803',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(201);
    });

    it('should be possible to create a customer with address', async () => {
      const response = await request(app)
        .post('/customer')
        .send({
          name: 'David Doe',
          email: 'david.doe@email.com',
          cpf: '201.474.280-41',
          phone: '(45) 92518-3645',
          cep: '01001-000',
          address: 'Praça da Sé',
          complement: 'lado ímpar',
          district: 'Sé',
          city: 'São Paulo',
          uf: 'SP',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(201);
    });
  });

  describe('Get All Customer', () => {
    it('should return all customers', async () => {
      const response = await request(app)
        .get('/customers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('Get One Customer', () => {
    it('should return status 400 if a customer does not exist', async () => {
      const response = await request(app)
        .get('/customer/100')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message', 'Cliente não encontrado');
    });

    it('should return a customer', async () => {
      const { id } = await sut.create();
      const response = await request(app)
        .get(`/customer/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('Update Customer', () => {
    it('should return status 409 if the email has already been registered', async () => {
      const customer = new SutCustomer(
        'Anny Doe',
        'anny.doe@email.com',
        '908.122.130-25',
        '(96) 93498-1258',
      );

      const { name, cpf, phone } = await customer.create();
      const { id } = await sut.create();

      const response = await request(app)
        .put(`/customer/${id}`)
        .send({
          name,
          email: 'anny.doe@email.com',
          cpf,
          phone,
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('message', 'E-mail já cadastrado');

      await customer.clear();
    });

    it('should return status 409 if the cpf has already been registered', async () => {
      const customer = new SutCustomer(
        'Marcus',
        'marcus.doe@email.com',
        '335.460.200-73',
        '(96) 93498-1258',
      );

      await customer.create();

      const { id } = await sut.create();

      const response = await request(app)
        .put(`/customer/${id}`)
        .send({
          name: 'Anny Mary',
          email: 'anny.mary@email.com',
          cpf: '335.460.200-73',
          phone: '(96) 93458-1458',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('message', 'CPF já cadastrado');

      await customer.clear();
    });

    it('should be possible to update a client', async () => {
      const { id, email, cpf, phone } = await sut.create();

      const response = await request(app)
        .put(`/customer/${id}`)
        .send({
          name: 'Anny Mary Smith',
          email,
          cpf,
          phone,
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(204);
    });
  });
});
