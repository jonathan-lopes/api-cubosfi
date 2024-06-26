const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { addDays } = require('date-fns');
const knex = require('../database');
const loginSchema = require('../validations/loginSchema');
const { BadRequestError } = require('../helpers/apiErrors');

const login = async (req, res) => {
  const { email, password } = req.body;

  await loginSchema.validate({ email, password }, { abortEarly: false });

  const user = await knex('users').where({ email }).first();

  if (!user) {
    throw new BadRequestError('E-mail ou senha inválidos');
  }

  const pwdCorrect = await bcrypt.compare(password, user.password);

  if (!pwdCorrect) {
    throw new BadRequestError('E-mail ou senha inválidos');
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_TOKEN, {
    expiresIn: process.env.EXPIRES_IN_TOKEN,
  });

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.SECRET_REFRESH_TOKEN,
    {
      expiresIn: process.env.EXPIRES_IN_REFRESH_TOKEN,
    },
  );

  const refreshTokenExpiresDate = addDays(
    new Date(),
    process.env.EXPIRES_REFRESH_TOKEN_DAYS,
  );

  await knex('users_tokens').insert({
    refresh_token: refreshToken,
    expires_date: refreshTokenExpiresDate,
    user_id: user.id,
  });

  const { password: _, created_at, updated_at, ...userLogin } = user;

  return res
    .status(200)
    .json({ user: userLogin, token, refresh_token: refreshToken });
};

module.exports = login;
