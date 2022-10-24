const knex = require('../database/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const schemaLogin = require('../validations/schemaLogin');
const { BadRequestError } = require('../helpers/apiErrors');

const login = async (req, res) => {
  const { email, password } = req.body;

  await schemaLogin.validate({ email, password });

  const user = await knex('users').where({ email }).first();

  if (!user) {
    throw new BadRequestError('E-mail ou senha inválidos');
  }

  const pwdCorrect = await bcrypt.compare(password, user.password);

  if (!pwdCorrect) {
    throw new BadRequestError('E-mail ou senha inválidos');
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });

  const { password: _, ...userLogin } = user;

  return res.status(200).json({ user: userLogin, token });
};

module.exports = login;
