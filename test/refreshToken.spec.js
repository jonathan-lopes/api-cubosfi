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

    const response2 = await request(app).post('/refresh-token').send({});

    expect(response2.statusCode).toBe(400);
  });

  it('should return status 401 if refresh token is expired', async () => {
    const refresh_token = jwt.sign(
      { id: 100 },
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
  });

  it('should return status 404 if not find refresh token', async () => {
    const refresh_token = jwt.sign(
      { id: 100 },
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
