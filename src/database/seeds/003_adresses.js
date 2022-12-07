const { v4: uuidv4 } = require('uuid');
const { idsCustomers } = require('./002_customers');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  await knex('adresses').del();
  await knex('adresses').insert([
    {
      id: uuidv4(),
      cep: '04002-010',
      street: 'Rua Treze de Maio',
      complement: 'Apartamento',
      district: 'Paraíso',
      city: 'São Paulo',
      uf: 'SP',
      customer_id: idsCustomers.customer1,
    },
    {
      id: uuidv4(),
      cep: '40170-110',
      street: ' Avenida Adhemar de Barros ',
      complement: 'Ondina',
      district: 'Ondina',
      city: 'Salvador',
      uf: 'BA',
      customer_id: idsCustomers.customer2,
    },
  ]);
};
