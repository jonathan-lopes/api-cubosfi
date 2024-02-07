const { faker } = require('@faker-js/faker/locale/pt_BR');

const createRandomUser = () => {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

const createRandomBilling = (due, status = 'paid') => {
  return {
    description: faker.lorem.sentence(5),
    status,
    value: +faker.random.numeric(5),
    due,
  };
};

const createRandomCustomer = () => {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    cpf: faker.random.numeric(11, { allowLeadingZeros: true }),
    phone: faker.phone.number('##9########'),
  };
};

module.exports = {
  createRandomUser,
  createRandomBilling,
  createRandomCustomer,
};
