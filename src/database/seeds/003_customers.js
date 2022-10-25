/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  await knex('customers').del();
  await knex('customers').insert([
    {
      name: 'Montana Marsh',
      email: 'sit.amet.orci@yahoo.com',
      cpf: '793.463.148-04',
      phone: '71492753129',
      address_id: 1,
    },
    {
      name: 'Georgia Hines',
      email: 'nulla.facilisi.sed@yahoo.net',
      cpf: '895.551.397-86',
      phone: '71535354803',
      address_id: 2,
    },
    {
      name: 'Wyatt Peck',
      email: 'dolor@google.ca',
      cpf: '359.675.224-02',
      phone: '71866818600',
    },
    {
      name: 'Karen Nelson',
      email: 'est.vitae@outlook.ca',
      cpf: '015.761.356-65',
      phone: '71141234289',
    },
    {
      name: 'Quinn Bennett',
      email: 'consectetuer.mauris@outlook.couk',
      cpf: '090.652.031-77',
      phone: '71664308316',
    },
  ]);
};
