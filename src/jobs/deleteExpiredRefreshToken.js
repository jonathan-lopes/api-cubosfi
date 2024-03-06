const schedule = require('node-schedule');
const knex = require('../database');

const job = schedule.scheduleJob(
  'deleteExpiredRefreshToken',
  '59 23 * 12/1 0',
  async () => {
    const tokens = await knex('users_tokens').where(
      'expires_date',
      '<',
      knex.fn.now(),
    );

    await Promise.all(
      tokens.map((token) => knex('users_tokens').del().where({ id: token.id })),
    );
  },
);

module.exports = job;
