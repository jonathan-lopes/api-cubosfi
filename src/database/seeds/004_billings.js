/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  const customersIDs = await knex('customers').select('id');

  await knex('billings').del();
  await knex('billings').insert([
    {
      description:
        'commodo ipsum. Suspendisse non leo. Vivamus nibh dolor, nonummy ac,',
      status: 'paid',
      value: 40000,
      due: '2023-03-10',
      customer_id: customersIDs[0].id,
    },
    {
      description:
        'molestie tortor nibh sit amet orci. Ut sagittis lobortis mauris.',
      status: 'paid',
      value: 40350,
      due: '2021-06-08',
      customer_id: customersIDs[0].id,
    },
    {
      description:
        'risus. Donec nibh enim, gravida sit amet, dapibus id, blandit',
      status: 'pending',
      value: 95600,
      due: '2022-03-18',
      customer_id: customersIDs[1].id,
    },
    {
      description:
        'et malesuada fames ac turpis egestas. Fusce aliquet magna a',
      status: 'pending',
      value: 75600,
      due: '2021-04-29',
      customer_id: customersIDs[1].id,
    },
    {
      description:
        'Curae Donec tincidunt. Donec vitae erat vel pede blandit congue.',
      status: 'pending',
      value: 25500,
      due: '2022-03-11',
      customer_id: customersIDs[2].id,
    },
  ]);
};
