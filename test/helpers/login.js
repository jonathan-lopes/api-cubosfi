const request = require('supertest');
const { SutUser } = require('./utils');

const login = async (app, data, route = 'login') => {
  const sutUser = new SutUser(data);
  const { email, password } = await sutUser.create();

  const { body } = await request(app).post(`/${route}`).send({
    email,
    password,
  });

  return body.token;
};

module.exports = login;
