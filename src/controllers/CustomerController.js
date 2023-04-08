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
      .select('id', 'name', 'email', 'cpf', 'phone')
      .where({ id })
      .first();

    if (!customer) {
      throw new NotFoundError('Cliente não encontrado');
    }

    const address = await knex('adresses')
      .select(
        'street',
        'complement',
        'cep',
        'district',
        'city',
        'uf',
        'customer_id',
      )
      .where({ customer_id: customer.id })
      .first();

    const bills = await knex('billings')
      .select('id', 'description', 'status', 'value', 'due', 'customer_id')
      .where('customer_id', id);

    const detailedCustomer = { ...customer, address, billings: bills };

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

    const body = {
      name,
      email,
      cpf,
      phone,
    };

    const [insertedCustomer] = await knex('customers')
      .insert(body)
      .returning('id');

    if (insertedCustomer === 0) {
      throw new DatabaseError('Não foi possível cadastrar o cliente');
    }

    if (address) {
      const insertedAddress = await knex('adresses').insert({
        ...address,
        customer_id: insertedCustomer.id,
      });

      if (!insertedAddress) {
        throw new DatabaseError('Não foi possível cadastrar o cliente');
      }
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

    const body = {
      name,
      email,
      cpf,
      phone,
    };

    const updatedCustomer = await knex('customers').update(body).where({ id });

    if (updatedCustomer === 0) {
      throw new DatabaseError('Não foi possível cadastrar o cliente');
    }

    const customerWithAddress = await knex('adresses')
      .where({ customer_id: id })
      .first();

    if (customerWithAddress && address) {
      const updateAddress = await knex('adresses')
        .update(address)
        .where({ customer_id: id });

      if (updateAddress === 0) {
        throw new DatabaseError('Não foi possível cadastrar o cliente');
      }
    }

    if (!customerWithAddress && address) {
      const insertedAddress = await knex('adresses').insert({
        ...address,
        customer_id: id,
      });

      if (insertedAddress === 0) {
        throw new DatabaseError('Não foi possível cadastrar o cliente');
      }
    }

    return res.sendStatus(204);
  }
}

module.exports = new CustomerController();
