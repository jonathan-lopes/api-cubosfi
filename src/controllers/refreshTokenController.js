const { addDays } = require('date-fns');
const jwt = require('jsonwebtoken');
const knex = require('../database');
const { NotFoundError, UnauthorizedError } = require('../helpers/apiErrors');
const refreshTokenSchema = require('../validations/refreshTokenSchema');

const refreshTokenController = async (req, res) => {
  const { refresh_token } = req.body;

  await refreshTokenSchema.validate({ refresh_token }, { abortEarly: false });

  const { id } = jwt.verify(
    refresh_token,
    process.env.SECRET_REFRESH_TOKEN,
    (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          throw new UnauthorizedError('refresh_token expirado');
        }
      }

      return decoded;
    },
  );

  const userToken = await knex('users_tokens')
    .where({
      refresh_token,
      user_id: id,
    })
    .first();

  if (!userToken) {
    throw new NotFoundError('refresh_token não encontrado');
  }

  await knex('users_tokens').del().where({ id: userToken.id });

  const newRefreshToken = jwt.sign({ id }, process.env.SECRET_REFRESH_TOKEN, {
    expiresIn: process.env.EXPIRES_IN_REFRESH_TOKEN,
  });

  const refreshTokenExpiresDate = addDays(
    new Date(),
    process.env.EXPIRES_REFRESH_TOKEN_DAYS,
  );

  await knex('users_tokens').insert({
    refresh_token: newRefreshToken,
    expires_date: refreshTokenExpiresDate,
    user_id: id,
  });

  const newToken = jwt.sign({ id }, process.env.SECRET_TOKEN, {
    expiresIn: process.env.EXPIRES_IN_TOKEN,
  });

  return res.json({ refresh_token: newRefreshToken, token: newToken });
};

module.exports = refreshTokenController;
