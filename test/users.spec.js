const { SutUser } = require('./helpers/utils');
const request = require('supertest');
const app = require('../src/server');
const knex = require('../src/database/connection');

const sut = new SutUser('testman#3', 'testman#3@email.com', 'testman1234');

describe('Endpoint Users', () => {
  describe('Create User', () => {
    afterEach(() => sut.clear());

    it('should fail if name are not sent in the body', async () => {
      let response = await request(app).post('/user').send({
        email: 'jonh.doe@email.com',
        password: 'doe12345',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'name é um campo obrigatório',
      );
    });

    it('should fail if email are not sent in the body', async () => {
      let response = await request(app).post('/user').send({
        name: 'jonh doe',
        password: 'doe12345',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'email é um campo obrigatório',
      );
    });

    it('should fail if password are not sent in the body', async () => {
      let response = await request(app).post('/user').send({
        name: 'jonh doe',
        email: 'doe12345',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'password é um campo obrigatório',
      );
    });

    it('should return 409 if email has already been registered', async () => {
      const { name, email, password } = await sut.create();

      const response = await request(app).post('/user').send({
        name,
        email,
        password,
      });

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('message', 'E-mail já cadastrado');
    });

    it('should return 201 if the user was registered', async () => {
      const { statusCode } = await request(app).post('/user').send({
        name: 'jonh Doe',
        email: 'jonh.doe@email.com',
        password: 'doe123456',
      });

      expect(statusCode).toBe(201);

      await knex('users').del().where({ email: 'jonh.doe@email.com' });
    });
  });

  describe('Get User', () => {
    afterEach(() => sut.clear());

    it('should not return data if not authenticated', async () => {
      const response = await request(app).get('/user');

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('message', 'Não autorizado');
    });

    it('should return user data', async () => {
      const { email, password } = await sut.create();

      const { body } = await request(app).post('/login').send({
        email,
        password,
      });

      const data = await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${body.token}`);

      expect(data.statusCode).toBe(200);
      expect(data.body).toHaveProperty('id');
      expect(data.body).toHaveProperty('email');
      expect(data.body).toHaveProperty('name');
      expect(data.body).toHaveProperty('cpf');
      expect(data.body).toHaveProperty('phone');
    });
  });

  describe('Update User', () => {
    afterEach(() => sut.clear());

    it('should return status code 400 if required fields (name, email) are not sent', async () => {
      const { email, password } = await sut.create();

      const { body } = await request(app).post('/login').send({
        email,
        password,
      });

      const response = await request(app)
        .put('/user')
        .send({})
        .set('Authorization', `Bearer ${body.token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'email é um campo obrigatório',
      );
    });

    it('should not be updating the email to another already registered', async () => {
      const { email, password, name } = await sut.create();

      const { body } = await request(app).post('/login').send({
        email,
        password,
      });

      const user = new SutUser('Jonh Doe', 'jonh.doe@email.com', 'doe12345');
      const data = await user.create();

      const response = await request(app)
        .put('/user')
        .send({
          email: data.email,
          name,
        })
        .set('Authorization', `Bearer ${body.token}`);

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('message', 'E-mail já cadastrado');

      await user.clear();
    });

    it('should not be updating the cpf to another already registered', async () => {
      const { email, password, name } = await sut.create();

      const { body } = await request(app).post('/login').send({
        email,
        password,
      });

      await request(app)
        .put('/user')
        .send({
          email,
          name,
          cpf: '835.888.910-05',
        })
        .set('Authorization', `Bearer ${body.token}`);

      const user = new SutUser('Jonh Doe', 'jonh.doe@email.com', 'doe12345');
      const data = await user.create();

      const responseLogin = await request(app).post('/login').send({
        email: data.email,
        password: data.password,
      });

      const response = await request(app)
        .put('/user')
        .send({
          email: data.email,
          name: data.name,
          cpf: '835.888.910-05',
        })
        .set('Authorization', `Bearer ${responseLogin.body.token}`);

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('message', 'CPF já cadastrado');
    });

    it('should return status 204 if user has been updated', async () => {
      const { email, password, name } = await sut.create();

      const { body } = await request(app).post('/login').send({
        email,
        password,
      });

      const { statusCode } = await request(app)
        .put('/user')
        .send({
          email,
          name,
          cpf: '835.888.910-05',
        })
        .set('Authorization', `Bearer ${body.token}`);

      expect(statusCode).toBe(204);
    });

    it('should be possible to change the user password', async () => {
      const { email, password, name, cpf, phone } = await sut.create();

      const { body } = await request(app).post('/login').send({
        email,
        password,
      });

      const newPasswd = 'newPass123456';

      const responseUserUpdate = await request(app)
        .put('/user')
        .send({
          email,
          name,
          cpf,
          phone,
          password: newPasswd,
        })
        .set('Authorization', `Bearer ${body.token}`);

      expect(responseUserUpdate.statusCode).toBe(204);

      const responseLogin = await request(app).post('/login').send({
        email,
        password: newPasswd,
      });

      expect(responseLogin.body).toHaveProperty('token');
      expect(responseLogin.statusCode).toBe(200);
    });
  });
});
