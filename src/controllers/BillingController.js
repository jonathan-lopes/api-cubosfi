const knex = require('../database');
const billingsRegisterSchema = require('../validations/billingsRegisterSchema');
const billingsEditSchema = require('../validations/billingsEditSchema');
const queryBillingSchema = require('../validations/billingsQueryParamsSchema');
const { isPending } = require('../helpers/paymentStatus');
const {
  DatabaseError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../helpers/apiErrors');
const isValidUUID = require('../helpers/isValidUUID');

class BillingController {
  async index(req, res) {
    const queryParams = req.query;

    await queryBillingSchema.validate(req, { abortEarly: false });

    const { pageNumber, pageSize } = req.pagination;

    const query = knex('billings')
      .join('customers', 'billings.customer_id', 'customers.id')
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

    if (queryParams.status) {
      query.where({
        status: queryParams.status,
      });
    }

    if (queryParams.is_overdue) {
      query.where({
        is_overdue: queryParams.is_overdue,
      });
    }

    if (queryParams.due_date) {
      query.where({
        due: queryParams.due_date,
      });
    }

    if (queryParams.due_date_start && queryParams.due_date_end) {
      query.whereBetween('billings.due', [
        queryParams.due_date_start,
        queryParams.due_date_end,
      ]);
    }

    if (queryParams.after_due_date) {
      query.where('billings.due', '>', queryParams.after_due_date);
    }

    if (queryParams.before_due_date) {
      query.where('billings.due', '<', queryParams.before_due_date);
    }

    if (queryParams.value) {
      query.where({
        value: queryParams.value,
      });
    }

    if (queryParams.value_lt && !queryParams.value_gt) {
      query.where('billings.value', '<', queryParams.value_lt);
    }

    if (queryParams.value_gt && !queryParams.value_lt) {
      query.where('billings.value', '>', queryParams.value_gt);
    }

    if (queryParams.value_start && queryParams.value_end) {
      query.whereBetween('billings.value', [
        queryParams.value_start,
        queryParams.value_end,
      ]);
    }

    const billings = await query
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize);

    return res.json(billings);
  }

  async show(req, res) {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      throw new BadRequestError('Id da cobrança inválido');
    }

    const detailedBilling = await knex('billings').where({ id }).first();

    if (!detailedBilling) {
      throw new NotFoundError('Cobrança não encontrada');
    }

    const { created_at, updated_at, ...billing } = detailedBilling;

    return res.json(billing);
  }

  async store(req, res) {
    const { customer_id, description, status, value, due } = req.body;

    const body = {
      customer_id,
      description,
      status,
      value,
      due,
    };

    await billingsRegisterSchema.validate(body, { abortEarly: false });

    const insertBilling = await knex('billings').insert(body);

    if (!insertBilling) {
      throw new DatabaseError('Não foi possível cadastrar a cobrança');
    }

    return res.sendStatus(201);
  }

  async update(req, res) {
    const { description, status, value, due } = req.body;
    const { id } = req.params;

    if (!isValidUUID(id)) {
      throw new BadRequestError('Id da cobrança inválido');
    }

    const body = {
      description,
      status,
      value,
      due,
    };

    await billingsEditSchema.validate(body, { abortEarly: false });

    const billing = await knex('billings').where({ id }).first();

    if (!billing) {
      throw new NotFoundError('Cobrança não encontrada');
    }

    const updateBilling = await knex('billings').update(body).where({ id });

    if (!updateBilling) {
      throw new DatabaseError('Não foi possível atualizar a cobrança');
    }

    return res.sendStatus(204);
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      throw new BadRequestError('Id da cobrança inválido');
    }

    const billing = await knex('billings').where({ id }).first();

    if (!billing) {
      throw new NotFoundError('Cobrança não encontrada');
    }

    if (isPending(billing.due, billing.status)) {
      const billingDelete = await knex('billings').del().where({ id });

      if (!billingDelete) {
        throw new DatabaseError('Não foi possível excluir a cobrança');
      }

      return res.sendStatus(204);
    }

    throw new ForbiddenError('Esta cobrança não pode ser excluída!');
  }
}

module.exports = new BillingController();
