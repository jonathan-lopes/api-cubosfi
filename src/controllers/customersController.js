const knex = require('../database/connection');
const schemaCustomer = require('../validations/schemaCustomer');
const paymentStatus = require('../helpers/paymentStatus');
const {
  ConflictError,
  CrudError,
  NotFoundError,
} = require('../helpers/apiErrors');

const create = async (req, res) => {
  const { name, email, cpf, phone, address } = req.body;
  let addressId = 0;

  await schemaCustomer.validate({
    name,
    email,
    cpf,
    phone,
    address,
  });

  const customerEmail = await knex('customers').where({ email }).first();

  if (customerEmail) {
    throw new ConflictError('E-mail já cadastrado');
  }

  const customerCpf = await knex('customers').where({ cpf }).first();

  if (customerCpf) {
    throw new ConflictError('CPF já cadastrado');
  }

  const body = {
    name,
    email,
    cpf,
    phone,
  };

  if (address) {
    [addressId] = await knex('adresses').insert(address).returning('id');

    if (!addressId) {
      throw new CrudError('Não foi possível cadastrar o cliente');
    }

    body.address_id = addressId.id;
  }

  const insertCustomer = await knex('customers').insert(body);

  if (insertCustomer === 0) {
    throw new CrudError('Não foi possível cadastrar o cliente');
  }

  return res.status(201).json();
};

const getAll = async (req, res) => {
  const customersList = [];
  const customers = await knex('customers').select(
    'id',
    'name',
    'email',
    'cpf',
    'phone',
    'address_id',
  );

  const billsData = await knex('billings').select(
    'id',
    'status',
    'due',
    'customer_id',
  );

  for (const bill of billsData) {
    if (paymentStatus.isOverdue(bill.due, bill.status)) {
      bill.status = 'overdue';
    }
  }

  for (let customer of customers) {
    const bills = billsData.filter((bill) => bill.customer_id === customer.id);

    customer = { ...customer, billings: bills };
    customersList.push(customer);
  }

  return res.status(200).json(customersList);
};

const getOne = async (req, res) => {
  const { id } = req.params;

  const customer = await knex('customers')
    .select('id', 'name', 'email', 'cpf', 'phone', 'address_id')
    .where({ id })
    .first();

  if (!customer) {
    throw new NotFoundError('Cliente não encontrado');
  }

  const address = await knex('adresses')
    .select('street', 'complement', 'cep', 'district', 'city', 'uf')
    .where({ id: customer.address_id })
    .first();

  const bills = await knex('billings')
    .select('id', 'description', 'status', 'value', 'due', 'customer_id')
    .where('customer_id', id);

  const detailedCustomer = { ...customer, address, billings: bills };

  return res.status(200).json(detailedCustomer);
};

const update = async (req, res) => {
  const { name, email, cpf, phone, address } = req.body;
  const { id } = req.params;

  await schemaCustomer.validate({
    name,
    email,
    cpf,
    phone,
    address,
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

  const { address_id: userWithAddress } = await knex('customers')
    .select('address_id')
    .where({ id })
    .first();

  if (userWithAddress) {
    const [customerAddressIdReturning] = await knex('customers')
      .update(body)
      .where({ id })
      .returning('address_id');

    if (customerAddressIdReturning === 0) {
      throw new CrudError('Não foi possível cadastrar o cliente');
    }

    if (address) {
      const updateAddress = await knex('adresses')
        .update(address)
        .where({ id: customerAddressIdReturning.address_id });

      if (updateAddress === 0) {
        throw new CrudError('Não foi possível cadastrar o cliente');
      }
    }

    return res.status(204).json();
  }

  if (address) {
    const [insertAddress] = await knex('adresses')
      .insert(address)
      .returning('id');

    if (insertAddress === 0) {
      throw new CrudError('Não foi possível cadastrar o cliente');
    }

    const customerAddressIdReturning = await knex('customers')
      .update({ ...body, address_id: insertAddress.id })
      .where({ id });

    if (customerAddressIdReturning === 0) {
      throw new CrudError('Não foi possível cadastrar o cliente');
    }
  }

  return res.status(204).json();
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
};
