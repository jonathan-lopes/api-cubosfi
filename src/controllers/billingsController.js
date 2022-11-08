const knex = require('../database/connection');
const schemaRegisterBilling = require('../validations/schemaRegisterBillings');
const schemaEditBilling = require('../validations/schemaEditBilling');
const { isPending } = require('../helpers/paymentStatus');
const {
  CrudError,
  BadRequestError,
  NotFoundError,
} = require('../helpers/apiErrors');

const create = async (req, res) => {
  const { customer_id, description, status, value, due } = req.body;

  const body = {
    customer_id,
    description,
    status,
    value,
    due,
  };

  await schemaRegisterBilling.validate(body);

  const insertBilling = await knex('billings').insert(body);

  if (insertBilling === 0) {
    throw new CrudError('Não foi possível cadastrar a cobrança');
  }

  return res.status(201).json();
};

const getAll = async (req, res) => {
  const billings = await knex('billings')
    .join('customers', 'billings.customer_id', '=', 'customers.id')
    .select('customers.name', 'customers.cpf', 'billings.*');

  return res.status(200).json(billings);
};

const del = async (req, res) => {
  const { id } = req.params;

  const billing = await knex('billings').where({ id }).first();

  if (!billing) {
    throw new NotFoundError('Cobrança não encontrada');
  }

  if (isPending(billing.due, billing.status)) {
    const billingDelete = await knex('billings').del().where({ id });

    if (!billingDelete) {
      throw new CrudError('Não foi possível exluir a cobrança');
    }

    return res.status(204).json();
  }

  throw new BadRequestError('Esta cobrança não pode ser excluída!');
};

const getOne = async (req, res) => {
  const { id } = req.params;

  const detailedBilling = await knex('billings').where({ id }).first();

  if (!detailedBilling) {
    throw new NotFoundError('Cobrança não encontrada');
  }

  return res.status(200).json(detailedBilling);
};

const update = async (req, res) => {
  const { description, status, value, due } = req.body;
  const { id } = req.params;

  const body = {
    description,
    status,
    value,
    due,
  };

  await schemaEditBilling.validate(body);

  const billing = await knex('billings').where({ id }).first();

  if (!billing) {
    throw new NotFoundError('Cobrança não encontrada');
  }

  const updateBilling = await knex('billings').update(body).where({ id });

  if (!updateBilling) {
    throw new CrudError('Não foi possível atualizar a cobrança');
  }

  return res.status(204).json();
};

module.exports = {
  create,
  getAll,
  del,
  getOne,
  update,
};
