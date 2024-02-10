const schedule = require('node-schedule');
const knex = require('../database');

const job = schedule.scheduleJob(
  'verifyBillingsOverdue',
  '0 18 * * 1-5',
  async () => {
    const bills = await knex('billings')
      .where('due', '<', knex.fn.now())
      .andWhere('status', 'pending');

    await Promise.all(
      bills.map((bill) =>
        knex('billings').update({ is_overdue: true }).where({ id: bill.id }),
      ),
    );
  },
);

module.exports = job;
