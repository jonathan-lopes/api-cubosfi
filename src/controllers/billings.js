const knex = require('../database/connection');
const schemaRegisterBillings = require('../validations/schemaRegisterBillings');
const schemaEditBillings = require('../validations/schemaEditBilling');
const { isPending } = require('../helpers/paymentStatus');
const {
  CrudError,
  BadRequestError,
  NotFoundError,
} = require('../helpers/apiErrors');

const registerBilling = async (req, res) => {
  const { customer_id, description, status, value, due } = req.body;

  const body = {
    customer_id,
    description,
    status,
    value,
    due,
  };

  await schemaRegisterBillings.validate(body);

  const insertBilling = await knex('billings').insert(body);

  if (insertBilling === 0) {
    throw new CrudError('Não foi possível cadastrar a cobrança');
  }

  return res.status(201).json();
};

const listBillings = async (req, res) => {
  const billings = await knex('billings')
    .join('customers', 'billings.customer_id', '=', 'customers.id')
    .select('customers.name', 'customers.cpf', 'billings.*');

  return res.status(200).json(billings);
};

const deleteBilling = async (req, res) => {
  const { id } = req.params;

  const billing = await knex('billings').where({ id }).first();

  if (isPending(billing.due, billing.status)) {
    const billingDelete = await knex('billings').del().where({ id });

    if (!billingDelete) {
      throw new CrudError('Não foi possível exluir a cobrança');
    }

    return res.status(204).json();
  }

  throw new BadRequestError('Esta cobrança não pode ser excluída!');
};

const detailBilling = async (req, res) => {
  const { id } = req.params;

  const detailedBilling = await knex('billings').where({ id }).first();

  if (!detailedBilling) {
    throw new NotFoundError('Cobrança não encontrada.');
  }

  return res.status(200).json(detailedBilling);
};

const editBilling = async (req, res) => {
  const { description, status, value, due } = req.body;

  const { id } = req.params;

  const body = {
    description,
    status,
    value,
    due,
  };

  await schemaEditBillings.validate(body);

  const updateBilling = await knex('billings').update(body).where({ id: id });

  if (updateBilling === 0) {
    throw new CrudError('Não foi possível atualizar a cobrança');
  }

  return res.status(204).json();
};

module.exports = {
  registerBilling,
  listBillings,
  deleteBilling,
  detailBilling,
  editBilling,
};
