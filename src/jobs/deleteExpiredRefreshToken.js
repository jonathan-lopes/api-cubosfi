const schedule = require('node-schedule');
const knex = require('../database');

const job = schedule.scheduleJob(
  'deleteExpiredRefreshToken',
  '59 23 * 12/1 0',
  async () => {
    const tokens = await knex('user_token').where(
      'expires_date',
      '<',
      knex.fn.now(),
    );

    const expiredTokens = [];

    tokens.forEach(async (token) => {
      expiredTokens.push(knex('user_token').del().where({ id: token.id }));
    });

    await Promise.all(expiredTokens);
  },
);

module.exports = job;
