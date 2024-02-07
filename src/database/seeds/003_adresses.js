/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  await knex('adresses').del();
  await knex('adresses').insert([
    {
      cep: '04002-010',
      street: 'Rua Treze de Maio',
      complement: 'Apartamento',
      district: 'Paraíso',
      city: 'São Paulo',
      uf: 'SP',
    },
    {
      cep: '40170-110',
      street: 'Avenida Adhemar de Barros',
      complement: 'Ondina',
      district: 'Ondina',
      city: 'Salvador',
      uf: 'BA',
    },
  ]);
};
