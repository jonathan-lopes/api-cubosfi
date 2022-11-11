const { add } = require('date-fns');
const jwt = require('jsonwebtoken');
const knex = require('../database/connection');
const { NotFoundError } = require('../helpers/apiErrors');
const refreshTokenSchema = require('../validations/schemaRefreshToken');

const refreshTokenController = async (req, res) => {
  const { refresh_token } = req.body;

  await refreshTokenSchema.validate({ refresh_token });

  const { id } = jwt.verify(refresh_token, process.env.SECRET_REFRESH_TOKEN);

  const userToken = await knex('user_token')
    .where({
      refresh_token,
      user_id: id,
    })
    .first();

  if (!userToken) {
    throw new NotFoundError('Refresh token não encontrado');
  }

  await knex('user_token').del().where({ id: userToken.id });

  const newRefreshToken = jwt.sign({ id }, process.env.SECRET_REFRESH_TOKEN, {
    expiresIn: process.env.EXPIRES_IN_REFRESH_TOKEN,
  });

  const refreshTokenExpiresDate = add(new Date(), {
    days: process.env.EXPIRES_REFRESH_TOKEN_DAYS,
  });

  await knex('user_token').insert({
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
