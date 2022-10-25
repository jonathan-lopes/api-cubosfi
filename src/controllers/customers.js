const knex = require('../database/connection');
const schemaCustomer = require('../validations/schemaCustomer');
const paymentStatus = require('../helpers/paymentStatus');
const {
  ConflictError,
  CrudError,
  NotFoundError,
} = require('../helpers/apiErrors');

const registerCustomer = async (req, res) => {
  const {
    name,
    email,
    cpf,
    phone,
    cep,
    address,
    complement,
    district,
    city,
    uf,
  } = req.body;
  let addressId = 0;

  await schemaCustomer.validate({
    name,
    email,
    cpf,
    phone,
    cep,
    address,
    complement,
    district,
    city,
    uf,
  });

  const customerEmail = await knex('customers').where({ email }).first();

  if (customerEmail) {
    throw new ConflictError('E-mail já cadastrado');
  }

  if (customerCpf) {
    throw new ConflictError('CPF já cadastrado');
  }

  if (cep || address || complement || district || city || uf) {
    addressId = await knex('adresses')
      .insert({
        address,
        complement,
        cep,
        district,
        city,
        uf,
      })
      .returning(['id']);

    if (!addressId) {
      throw new CrudError('Não foi possível cadastrar o cliente');
    }

    body.address_id = addressId[0].id;
  }

  const insertCustomer = await knex('customers').insert(body);

  if (insertCustomer === 0) {
    throw new CrudError('Não foi possível cadastrar o cliente');
  }

  return res.status(201).json();
};

const listCustomers = async (req, res) => {
  const customersList = [];
  const customers = await knex('customers');

  for (let customer of customers) {
    const bills = await knex('billings')
      .select('id', 'status', 'due')
      .where({ customer_id: customer.id });

    for (const bill of bills) {
      if (paymentStatus.isOverdue(bill.due, bill.status)) {
        bill.status = 'overdue';
      }
    }

    customer = { ...customer, billings: bills };
    customersList.push(customer);
  }

  return res.status(200).json(customersList);
};

const detailCustomer = async (req, res) => {
  const { id } = req.params;

  const customer = await knex('customers').where({ id }).first();

  if (!customer) {
    throw new NotFoundError('Cliente não encontrado.');
  }

  const address = await knex('adresses')
    .select('address', 'complement', 'cep', 'district', 'city', 'uf')
    .where('id', customer.address_id)
    .first();

  const bills = await knex('billings').where('customer_id', id);

  const detailedCustomer = { ...customer, ...address, billings: bills };

  return res.status(200).json(detailedCustomer);
};

const updateCustomer = async (req, res) => {
  const {
    name,
    email,
    cpf,
    phone,
    cep,
    address,
    complement,
    district,
    city,
    uf,
  } = req.body;
  const { id } = req.params;

  await schemaCustomer.validate({
    name,
    email,
    cpf,
    phone,
    cep,
    address,
    complement,
    district,
    city,
    uf,
  });

  const customerEmail = await knex('customers')
    .whereRaw('email = ? AND id <> ?', [email, id])
    .first();

  if (customerEmail) {
    throw new ConflictError('E-mail já cadastrado');
  }

  const customerCpf = await knex('customers')
    .whereRaw('cpf = ? AND id <> ?', [cpf, id])
    .first();

  if (customerCpf) {
    throw new ConflictError('CPF já cadastrado');
  }

  const body = {
    name,
    email,
    cpf,
    phone,
  };

  const customerAddressIdReturning = await knex('customers')
    .update(body)
    .where('id', id)
    .returning('address_id');

  if (customerAddressIdReturning === 0) {
    throw new CrudError('Não foi possível cadastrar o cliente');
  }

  if (cep || address || complement || district || city || uf) {
    const updateAddress = await knex('adresses')
      .update({
        address,
        complement,
        cep,
        district,
        city,
        uf,
      })
      .where('id', customerAddressIdReturning[0]);

    if (updateAddress === 0) {
      throw new CrudError('Não foi possível cadastrar o cliente');
    }
  }

  return res.status(204).json();
};

module.exports = {
  registerCustomer,
  listCustomers,
  detailCustomer,
  updateCustomer,
};
