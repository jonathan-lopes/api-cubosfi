const request = require('supertest');
const app = require('../../src/server');
const { SutUser } = require('../helpers/utils');
const {
  createRandomUser,
  createRandomCustomer,
} = require('../helpers/randomData');
const login = require('../helpers/login');
const knex = require('../../src/database');

let token = '';

describe('Update User', () => {
  beforeAll(async () => {
    token = await login(app, createRandomUser());
  });

  afterAll(async () => await knex.destroy());

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
      'message.email',
      'email é obrigatório',
    );
    expect(response.body).toHaveProperty('message.name', 'name é obrigatório');
  });

  it('should not be possible to update the email to another already registered', async () => {
    const user = new SutUser(createRandomUser());

    const { email } = await user.create();

    const response = await request(app)
      .put('/user')
      .send({
        email,
        name: 'Billy Kane',
        cpf: '27038316257',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty(
      'message.error',
      'E-mail já cadastrado',
    );
    expect(response.body).toHaveProperty('status', 409);
    expect(response.body).toHaveProperty('type', 'ConflictError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should not be possible to update a cpf to another already registered', async () => {
    const { email, name } = createRandomUser();
    const cpf = '835.888.910-05';

    await request(app)
      .put('/user')
      .send({
        email,
        name,
        cpf,
      })
      .set('Authorization', `Bearer ${token}`);

    const newUser = new SutUser(createRandomUser());
    const data = await newUser.create();

    const responseLogin = await request(app).post('/login').send({
      email: data.email,
      password: data.password,
    });

    const response = await request(app)
      .put('/user')
      .send({
        email: data.email,
        name: data.name,
        cpf,
      })
      .set('Authorization', `Bearer ${responseLogin.body.token}`);

    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('status', 409);
    expect(response.body).toHaveProperty('message.error', 'CPF já cadastrado');
    expect(response.body).toHaveProperty('type', 'ConflictError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should return status 204 if user has been updated', async () => {
    const user = createRandomUser();

    const { statusCode } = await request(app)
      .put('/user')
      .send({
        email: user.email,
        name: user.name,
        cpf: '035.878.910-05',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(204);
  });

  it('should be possible to change the user password', async () => {
    const newPasswd = 'newPass123456';

    const updatedUser = {
      ...createRandomCustomer(),
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
