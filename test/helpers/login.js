const request = require('supertest');
const { SutUser } = require('./utils');

const login = async (app, route = 'login', data) => {
  const sutUser = new SutUser(data.name, data.email, data.password);
  const { email, password } = await sutUser.create();

  const { body } = await request(app).post(`/${route}`).send({
    email,
    password,
  });

  return body.token;
};

module.exports = login;
