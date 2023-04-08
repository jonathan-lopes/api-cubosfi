const schedule = require('node-schedule');
const knex = require('../database');

const job = schedule.scheduleJob(
  'verifyBillingsOverdue',
  '0 18 * * 1-5',
  async () => {
    const bills = await knex('billings')
      .where('due', '<', knex.fn.now())
      .andWhere('status', 'pending');

    const billsOverdue = [];

    bills.forEach(async (bill) => {
      billsOverdue.push(
        knex('billings').update({ is_overdue: true }).where({ id: bill.id }),
      );
    });

    await Promise.all(billsOverdue);
  },
);

module.exports = job;
