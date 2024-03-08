const knex = require('../database');
const schemaCustomer = require('../validations/schemaCustomer');
const {
  ConflictError,
  DatabaseError,
  NotFoundError,
  BadRequestError,
} = require('../helpers/apiErrors');
const isValidUUID = require('../helpers/isValidUUID');

class CustomerController {
  async index(req, res) {
    const customersList = [];
    const customers = await knex('customers').select(
      'id',
      'name',
      'email',
      'cpf',
      'phone',
    );

    const billsData = await knex('billings').select(
      'id',
      'status',
      'due',
      'customer_id',
    );

    for (let customer of customers) {
      const bills = billsData.filter(
        (bill) => bill.customer_id === customer.id,
      );

      customer = { ...customer, billings: bills };
      customersList.push(customer);
    }

    return res.json(customersList);
  }

  async show(req, res) {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      throw new BadRequestError('Id de cliente inválido');
    }

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
      .where({ customer_id: id });

    const { address_id, ...customerWithoutAddress_id } = customer;

    const detailedCustomer = {
      ...customerWithoutAddress_id,
      address,
      billings: bills,
    };

    return res.json(detailedCustomer);
  }

  async store(req, res) {
    const { name, email, cpf, phone, address } = req.body;

    await schemaCustomer.validate(
      {
        name,
        email,
        cpf,
        phone,
        address,
      },
      { abortEarly: false },
    );

    const customerEmail = await knex('customers').where({ email }).first();

    if (customerEmail) {
      throw new ConflictError('E-mail já cadastrado');
    }

    const customerCpf = await knex('customers').where({ cpf }).first();

    if (customerCpf) {
      throw new ConflictError('CPF já cadastrado');
    }

    let addressID = '';

    if (address) {
      const [data] = await knex('adresses').insert(address).returning('id');

      addressID = data.id;

      if (!addressID) {
        throw new DatabaseError('Não foi possível cadastrar o cliente');
      }
    }

    const body = {
      name,
      email,
      cpf,
      phone,
      address_id: addressID || null,
    };

    const insertedCustomer = await knex('customers').insert(body);

    if (!insertedCustomer) {
      throw new DatabaseError('Não foi possível cadastrar o cliente');
    }

    return res.sendStatus(201);
  }

  async update(req, res) {
    const { name, email, cpf, phone, address } = req.body;
    const { id } = req.params;

    if (!isValidUUID(id)) {
      throw new BadRequestError('Id de cliente inválido');
    }

    await schemaCustomer.validate(
      {
        name,
        email,
        cpf,
        phone,
        address,
      },
      { abortEarly: false },
    );

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

    let addressID = '';

    if (address) {
      const customerWithAddress = await knex('customers')
        .select('address_id')
        .where({ id })
        .first();

      if (customerWithAddress.address_id) {
        const updateAddress = await knex('adresses')
          .update(address)
          .where({ id: customerWithAddress.address_id });

        if (!updateAddress) {
          throw new DatabaseError('Não foi possível cadastrar o cliente');
        }

        return res.sendStatus(204);
      }

      if (!customerWithAddress.address_id) {
        const [data] = await knex('adresses').insert(address).returning('id');

        addressID = data.id;

        if (!addressID) {
          throw new DatabaseError('Não foi possível cadastrar o cliente');
        }
      }
    }

    const dataCustomer = {
      name,
      email,
      cpf,
      phone,
      address_id: addressID || null,
    };

    const updatedCustomer = await knex('customers')
      .update(dataCustomer)
      .where({ id });

    if (!updatedCustomer) {
      throw new DatabaseError('Não foi possível cadastrar o cliente');
    }

    return res.sendStatus(204);
  }
}

module.exports = new CustomerController();
