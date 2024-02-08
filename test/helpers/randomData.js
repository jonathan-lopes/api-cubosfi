const { faker } = require('@faker-js/faker/locale/pt_BR');

const createRandomUser = () => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

const createRandomBilling = (due, status = 'paid') => {
  return {
    description: faker.lorem.sentence(5),
    status,
    value: +faker.string.numeric(5),
    due,
  };
};

const createRandomCustomer = () => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: faker.string.numeric(11, { allowLeadingZeros: true }),
    phone: faker.phone.number('##9########'),
  };
};

module.exports = {
  createRandomUser,
  createRandomBilling,
  createRandomCustomer,
};