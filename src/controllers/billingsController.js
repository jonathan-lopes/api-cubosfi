const knex = require('../database/connection');
const schemaRegisterBilling = require('../validations/schemaRegisterBillings');
const schemaEditBilling = require('../validations/schemaEditBilling');
const { isPending } = require('../helpers/paymentStatus');
const {
  DatabaseError,
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
    throw new DatabaseError('Não foi possível cadastrar a cobrança');
  }

  return res.status(201).json();
};

const getAll = async (req, res) => {
  const {
    status,
    is_overdue,
    cpf,
    due_date,
    after_due_date,
    before_due_date,
    less_than_value,
    greater_than_value,
  } = req.query;

  const query = knex('billings')
    .join('customers', 'billings.customer_id', '=', 'customers.id')
    .select(
      'customers.name',
      'customers.cpf',
      'billings.id',
      'billings.description',
      'billings.status',
      'billings.value',
      'billings.due',
      'billings.is_overdue',
      'billings.customer_id',
    );

  if (status) {
    query.where({
      status,
    });
  }

  if (is_overdue) {
    query.where({
      is_overdue,
    });
  }

  if (cpf) {
    query.where({
      cpf,
    });
  }

  if (due_date) {
    query.where({
      due: due_date,
    });
  }

  if (after_due_date) {
    query.where('billings.due', '>', after_due_date);
  }

  if (before_due_date) {
    query.where('billings.due', '<', before_due_date);
  }

  if (less_than_value && !greater_than_value) {
    query.where('billings.value', '<', less_than_value);
  }

  if (greater_than_value && !less_than_value) {
    query.where('billings.value', '>', greater_than_value);
  }

  if (less_than_value && greater_than_value) {
    query.whereNotBetween('billings.value', [
      less_than_value,
      greater_than_value,
    ]);
  }

  const billings = await query;

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
      throw new DatabaseError('Não foi possível excluir a cobrança');
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

  const { created_at, updated_at, ...billing } = detailedBilling;

  return res.status(200).json(billing);
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
    throw new DatabaseError('Não foi possível atualizar a cobrança');
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
