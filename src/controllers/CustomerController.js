const knex = require('../database');
const customersSchema = require('../validations/customersSchema');
const customersQueryParamsSchema = require('../validations/customersQueryParamsSchema');
const {
  ConflictError,
  DatabaseError,
  NotFoundError,
  BadRequestError,
} = require('../helpers/apiErrors');
const isValidUUID = require('../helpers/isValidUUID');
const CustomerMapper = require('./mappers/CustomerMapper');

class CustomerController {
  async index(req, res) {
    await customersQueryParamsSchema.validate(req, { abortEarly: false });

    const { pageNumber, pageSize } = req.pagination;

    const customersList = [];

    const customers = await knex('customers')
      .select('id', 'name', 'email', 'cpf', 'phone')
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const billsData = await knex('billings').select(
      'id',
      'status',
      'due',
      'customer_id',
      'description',
      'value',
      'is_overdue',
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

    const billings = await knex('billings')
      .select('id', 'description', 'status', 'value', 'due', 'customer_id')
      .where({ customer_id: id });

    const { address_id, ...customerWithoutAddressID } = customer;

    const detailedCustomer = {
      ...customerWithoutAddressID,
      address,
      billings,
    };

    return res.json(detailedCustomer);
  }

  async store(req, res) {
    const dataDomain = CustomerMapper.toDomain(req.body);

    await customersSchema.validate(dataDomain, { abortEarly: false });

    const customerEmail = await knex('customers')
      .where({ email: dataDomain.email })
      .first();

    if (customerEmail) {
      throw new ConflictError('E-mail já cadastrado');
    }

    const customerCpf = await knex('customers')
      .where({ cpf: dataDomain.cpf })
      .first();

    if (customerCpf) {
      throw new ConflictError('CPF já cadastrado');
    }

    let addressID = '';

    if (dataDomain.address) {
      const [data] = await knex('adresses')
        .insert(dataDomain.address)
        .returning('id');

      addressID = data.id;

      if (!addressID) {
        throw new DatabaseError('Não foi possível cadastrar o cliente');
      }
    }

    const data = {
      ...dataDomain,
      address_id: addressID || null,
    };

    const { address, ...persistenceData } = data;

    const insertedCustomer = await knex('customers').insert(persistenceData);

    if (!insertedCustomer) {
      throw new DatabaseError('Não foi possível cadastrar o cliente');
    }

    return res.sendStatus(201);
  }

  async update(req, res) {
    const dataDomain = CustomerMapper.toDomain(req.body);
    const { id } = req.params;

    if (!isValidUUID(id)) {
      throw new BadRequestError('Id de cliente inválido');
    }

    await customersSchema.validate(dataDomain, { abortEarly: false });

    const customerEmail = await knex('customers')
      .whereRaw('email = ? AND id <> ?', [dataDomain.email, id])
      .first();

    if (customerEmail) {
      throw new ConflictError('E-mail já cadastrado');
    }

    const customerCpf = await knex('customers')
      .whereRaw('cpf = ? AND id <> ?', [dataDomain.cpf, id])
      .first();

    if (customerCpf) {
      throw new ConflictError('CPF já cadastrado');
    }

    let addressID = '';

    if (dataDomain.address) {
      const customerWithAddress = await knex('customers')
        .select('address_id')
        .where({ id })
        .first();

      if (customerWithAddress.address_id) {
        const updateAddress = await knex('adresses')
          .update(dataDomain.address)
          .where({ id: customerWithAddress.address_id });

        if (!updateAddress) {
          throw new DatabaseError('Não foi possível cadastrar o cliente');
        }

        return res.sendStatus(204);
      }

      if (!customerWithAddress.address_id) {
        const [data] = await knex('adresses')
          .insert(dataDomain.address)
          .returning('id');

        addressID = data.id;

        if (!addressID) {
          throw new DatabaseError('Não foi possível cadastrar o cliente');
        }
      }
    }

    const data = {
      ...dataDomain,
      address_id: addressID || null,
    };

    const { address, ...persistenceData } = data;

    const updatedCustomer = await knex('customers')
      .update(persistenceData)
      .where({ id });

    if (!updatedCustomer) {
      throw new DatabaseError('Não foi possível cadastrar o cliente');
    }

    return res.sendStatus(204);
  }
}

module.exports = new CustomerController();
