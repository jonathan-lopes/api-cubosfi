const { v4: uuidv4 } = require('uuid');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const idsCustomers = {
  customer1: uuidv4(),
  customer2: uuidv4(),
};

const seed = async (knex) => {
  await knex('customers').del();
  await knex('customers').insert([
    {
      id: idsCustomers.customer1,
      name: 'Montana Marsh',
      email: 'sit.amet.orci@yahoo.com',
      cpf: '793.463.148-04',
      phone: '71492753129',
    },
    {
      id: idsCustomers.customer2,
      name: 'Georgia Hines',
      email: 'nulla.facilisi.sed@yahoo.net',
      cpf: '895.551.397-86',
      phone: '71535354803',
    },
    {
      id: uuidv4(),
      name: 'Wyatt Peck',
      email: 'dolor@google.ca',
      cpf: '359.675.224-02',
      phone: '71866818600',
    },
    {
      id: uuidv4(),
      name: 'Karen Nelson',
      email: 'est.vitae@outlook.ca',
      cpf: '015.761.356-65',
      phone: '71141234289',
    },
    {
      id: uuidv4(),
      name: 'Quinn Bennett',
      email: 'consectetuer.mauris@outlook.couk',
      cpf: '090.652.031-77',
      phone: '71664308316',
    },
  ]);
};

module.exports = { idsCustomers, seed };
