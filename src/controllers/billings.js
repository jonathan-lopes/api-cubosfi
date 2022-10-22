const knex = require('../database/connection');
const schemaRegisterBillings = require('../validations/schemaRegisterBillings');
const schemaEditBillings = require('../validations/schemaEditBilling');
const { isPending } = require('../helpers/paymentStatus');

const registerBilling = async (req, res) => {
  const { customer_id, description, status, value, due } = req.body;

  try {
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
      return res
        .status(500)
        .json({ message: 'Não foi possível cadastrar a cobrança' });
    }

    return res.status(201).json();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const listBillings = async (req, res) => {
  try {
    const billings = await knex('billings')
      .join('customers', 'billings.customer_id', '=', 'customers.id')
      .select('customers.name', 'customers.cpf', 'billings.*');

    return res.status(200).json(billings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteBilling = async (req, res) => {
  const { id } = req.params;

  try {
    const billing = await knex('billings').where({ id }).first();

    if (isPending(billing.due, billing.status)) {
      const billingDelete = await knex('billings').del().where({ id });

      if (!billingDelete) {
        return res.status(400).json('Não foi possível exluir a cobrança');
      }

      return res.status(204).json();
    }

    return res
      .status(400)
      .json({ message: 'Esta cobrança não pode ser excluída!' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const detailBilling = async (req, res) => {
  const { id } = req.params;

  try {
    const detailedBilling = await knex('billings').where({ id }).first();

    if (!detailedBilling) {
      return res.status(400).json({ message: 'Cobrança não encontrada.' });
    }

    return res.status(200).json(detailedBilling);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const editBilling = async (req, res) => {
  const { description, status, value, due } = req.body;

  const { id } = req.params;

  try {
    const body = {
      description,
      status,
      value,
      due,
    };

    await schemaEditBillings.validate(body);

    const updateBilling = await knex('billings').update(body).where({ id: id });

    if (updateBilling === 0) {
      return res
        .status(500)
        .json({ message: 'Não foi possível atualizar a cobrança' });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  registerBilling,
  listBillings,
  deleteBilling,
  detailBilling,
  editBilling,
};
