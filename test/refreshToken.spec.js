const request = require('supertest');
const app = require('../src/server');
const jwt = require('jsonwebtoken');
const { SutUser, SutRefreshToken } = require('./helpers/utils');

let sutUser = new SutUser('tesman#6', 'testman#6@email.com', 'testman1234');

describe('Refresh Token', () => {
  afterEach(() => sutUser.clear());

  it('should return status 400 if refresh token was not sent or if different from string type', async () => {
    const response1 = await request(app).post('/refresh-token').send({
      refresh_token: 1000,
    });

    expect(response1.statusCode).toBe(400);
    expect(response1.body).toHaveProperty(
      'message',
      'refresh_token deve ser um tipo de `string`, Mas o valor final foi: `1000`.',
    );
    expect(response1.body).toHaveProperty('status', 400);
    expect(response1.body).toHaveProperty('type', 'ValidationError');
    expect(response1.body).toHaveProperty('dateTime');

    const response2 = await request(app).post('/refresh-token').send({});

    expect(response2.statusCode).toBe(400);
    expect(response2.body).toHaveProperty(
      'message',
      'refresh_token é um campo obrigatório',
    );
    expect(response2.body).toHaveProperty('status', 400);
    expect(response2.body).toHaveProperty('type', 'ValidationError');
    expect(response2.body).toHaveProperty('dateTime');
  });

  it('should return status 401 if refresh token is expired', async () => {
    const refresh_token = jwt.sign(
      { id: '8db2148e-438f-4404-8393-604a1602411e' },
      process.env.SECRET_REFRESH_TOKEN,
      {
        expiresIn: '0s',
      },
    );

    const response = await request(app).post('/refresh-token').send({
      refresh_token,
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'refresh_token expirado');
    expect(response.body).toHaveProperty('status', 401);
    expect(response.body).toHaveProperty('type', 'UnauthorizedError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should return status 404 if not find refresh token', async () => {
    const refresh_token = jwt.sign(
      { id: '4bb8d3da-4a34-477d-8eef-6402bef6bf34' },
      process.env.SECRET_REFRESH_TOKEN,
      {
        expiresIn: process.env.EXPIRES_IN_REFRESH_TOKEN,
      },
    );

    const { id } = await sutUser.create();
    const sut = new SutRefreshToken(refresh_token, new Date(), id);
    await sut.create();

    const response = await request(app).post('/refresh-token').send({
      refresh_token,
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty(
      'message',
      'refresh_token não encontrado',
    );
    expect(response.body).toHaveProperty('status', 404);
    expect(response.body).toHaveProperty('type', 'NotFoundError');
    expect(response.body).toHaveProperty('dateTime');
  });

  it('should return a new refresh_token and a new token', async () => {
    const { id } = await sutUser.create();

    const refresh_token = jwt.sign(
      { id: id },
      process.env.SECRET_REFRESH_TOKEN,
      {
        expiresIn: process.env.EXPIRES_IN_REFRESH_TOKEN,
      },
    );

    const sut = new SutRefreshToken(refresh_token, new Date(), id);
    await sut.create();

    const response = await request(app).post('/refresh-token').send({
      refresh_token,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('refresh_token');
    expect(response.body).toHaveProperty('token');
  });
});
