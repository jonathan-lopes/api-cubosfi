const request = require('supertest');
const app = require('../../src/server');
const { createRandomUser } = require('../helpers/randomData');
const knex = require('../../src/database');

describe('Create User', () => {
  afterAll(async () => await knex.destroy());

  it('should fail if password, name and email are not sent in the body', async () => {
    const response = await request(app).post('/user').send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('status', 400);
    expect(response.body).toHaveProperty('type', 'ValidationError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty(
      'message.email',
      'email é obrigatório',
    );
    expect(response.body).toHaveProperty(
      'message.password',
      'password é obrigatório',
    );
    expect(response.body).toHaveProperty('message.name', 'name é obrigatório');
  });

  it('should return 409 if email has already been registered', async () => {
    const randomData = createRandomUser();

    await request(app).post('/user').send(randomData);

    const response = await request(app).post('/user').send({
      name: 'David Doe',
      email: randomData.email,
      password: 'doe123456',
    });

    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('status', 409);
    expect(response.body).toHaveProperty('type', 'ConflictError');
    expect(response.body).toHaveProperty('dateTime');
    expect(response.body).toHaveProperty(
      'message.error',
      'E-mail já cadastrado',
    );
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
      'message.password',
      'password deve ter no mínimo 8 caracteres',
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
      'message.password',
      'password deve ter no máximo 56 caracteres',
    );
  });

  it('should return 201 if the user was registered', async () => {
    const { statusCode } = await request(app)
      .post('/user')
      .send(createRandomUser());

    expect(statusCode).toBe(201);
  });
});
