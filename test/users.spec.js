const { SutUser } = require('./helpers/utils');
const request = require('supertest');
const app = require('../src/server');
const login = require('./helpers/login');

let token = '';

describe('Endpoint Users', () => {
  beforeAll(async () => {
    token = await login(app, 'login', {
      name: 'testman#3',
      email: 'testman#3@email.com',
      password: 'testman1234',
    });
  });

  describe('Create User', () => {
    it('should fail if name are not sent in the body', async () => {
      let response = await request(app).post('/user').send({
        email: 'jonh.doe@email.com',
        password: 'doe12345',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('status', 400);
      expect(response.body).toHaveProperty('type', 'ValidationError');
      expect(response.body).toHaveProperty('dateTime');
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
      expect(response.body).toHaveProperty('status', 400);
      expect(response.body).toHaveProperty('type', 'ValidationError');
      expect(response.body).toHaveProperty('dateTime');
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
      expect(response.body).toHaveProperty('status', 400);
      expect(response.body).toHaveProperty('type', 'ValidationError');
      expect(response.body).toHaveProperty('dateTime');
      expect(response.body).toHaveProperty(
        'message',
        'password é um campo obrigatório',
      );
    });

    it('should return 409 if email has already been registered', async () => {
      const response = await request(app).post('/user').send({
        name: 'David Doe',
        email: 'testman#3@email.com',
        password: 'doe123456',
      });

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('status', 409);
      expect(response.body).toHaveProperty('type', 'ConflictError');
      expect(response.body).toHaveProperty('dateTime');
      expect(response.body).toHaveProperty('message', 'E-mail já cadastrado');
    });

    it('should return 400 if password is not at least 8 characters long', async () => {
      const response = await request(app).post('/user').send({
        name: 'Jonh Doe',
        email: 'jonh.doe@email.com',
        password: 'doe',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('status', 400);
      expect(response.body).toHaveProperty('type', 'ValidationError');
      expect(response.body).toHaveProperty('dateTime');
      expect(response.body).toHaveProperty(
        'message',
        'password deve ser pelo menos 8 caracteres',
      );
    });

    it('should return 400 if password is more than 56 characters', async () => {
      const response = await request(app).post('/user').send({
        name: 'Jonh Doe',
        email: 'jonh.doe@email.com',
        password: 'rc8Yu1Y1gnor^6Ew8LpnuxKUJB3I2AlW7T#4JvThXbZdo!i7sF1111114',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('status', 400);
      expect(response.body).toHaveProperty('type', 'ValidationError');
      expect(response.body).toHaveProperty('dateTime');
      expect(response.body).toHaveProperty(
        'message',
        'password deve ser no máximo 56 caracteres',
      );
    });

    it('should return 201 if the user was registered', async () => {
      const { statusCode } = await request(app).post('/user').send({
        name: 'Anny Mary',
        email: 'anny.mary@email.com',
        password: 'anny123456',
      });

      expect(statusCode).toBe(201);
    });
  });

  describe('Get User', () => {
    it('should not return data if not authenticated', async () => {
      const response = await request(app).get('/user');

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('status', 401);
      expect(response.body).toHaveProperty('type', 'UnauthorizedError');
      expect(response.body).toHaveProperty('dateTime');
      expect(response.body).toHaveProperty('message', 'Não autorizado');
    });

    it('should return user data', async () => {
      const data = await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${token}`);

      expect(data.statusCode).toBe(200);
      expect(data.body).toHaveProperty('id');
      expect(data.body).toHaveProperty('email');
      expect(data.body).toHaveProperty('name');
      expect(data.body).toHaveProperty('cpf');
      expect(data.body).toHaveProperty('phone');
    });
  });

  describe('Update User', () => {
    it('should return status code 400 if required fields (name, email) are not sent', async () => {
      const response = await request(app)
        .put('/user')
        .send({})
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('status', 400);
      expect(response.body).toHaveProperty('type', 'ValidationError');
      expect(response.body).toHaveProperty('dateTime');
      expect(response.body).toHaveProperty(
        'message',
        'email é um campo obrigatório',
      );
    });

    it('should not be possible to update the email to another already registered', async () => {
      const sut = new SutUser(
        'Billy Kane',
        'bill.kane@email.com',
        'kanekane12134',
      );

      await sut.create();

      const response = await request(app)
        .put('/user')
        .send({
          email: 'bill.kane@email.com',
          name: 'Billy',
          cpf: '27038316257',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('message', 'E-mail já cadastrado');
      expect(response.body).toHaveProperty('status', 409);
      expect(response.body).toHaveProperty('type', 'ConflictError');
      expect(response.body).toHaveProperty('dateTime');

      await sut.clear();
    });

    it('should not be updating the cpf to another already registered', async () => {
      await request(app)
        .put('/user')
        .send({
          email: 'testman#3@email.com',
          name: 'Billy',
          cpf: '835.888.910-05',
        })
        .set('Authorization', `Bearer ${token}`);

      const sut = new SutUser('Jonh Doe', 'jonh.doe@email.com', 'doe12345');
      const data = await sut.create();

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
      expect(response.body).toHaveProperty('status', 409);
      expect(response.body).toHaveProperty('message', 'CPF já cadastrado');
      expect(response.body).toHaveProperty('type', 'ConflictError');
      expect(response.body).toHaveProperty('dateTime');

      await sut.clear();
    });

    it('should return status 204 if user has been updated', async () => {
      const { statusCode } = await request(app)
        .put('/user')
        .send({
          email: 'billy@email.com',
          name: 'Billy',
          cpf: '835.888.910-05',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(204);
    });

    it('should be possible to change the user password', async () => {
      const newPasswd = 'newPass123456';

      const updatedUser = {
        email: 'billy@email.com',
        name: 'Billy',
        cpf: '14534482680',
        phone: '(82) 98784-2630',
        password: newPasswd,
      };

      const responseUserUpdate = await request(app)
        .put('/user')
        .send(updatedUser)
        .set('Authorization', `Bearer ${token}`);

      expect(responseUserUpdate.statusCode).toBe(204);

      const responseLogin = await request(app).post('/login').send({
        email: updatedUser.email,
        password: updatedUser.password,
      });

      expect(responseLogin.body).toHaveProperty('token');
      expect(responseLogin.body).toHaveProperty('refresh_token');
      expect(responseLogin.body).toHaveProperty('user');
      expect(responseLogin.statusCode).toBe(200);
    });
  });
});
