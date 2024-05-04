const { isMatch } = require('date-fns');
const { validateStatus } = require('../helpers/regex');
const yup = require('./yupSettings');

// eslint-disable-next-line func-names
yup.addMethod(yup.StringSchema, 'validDateFormat', function () {
  return this.test(
    'date-is-valid',
    'data inválida, formato deve ser yyyy-dd-mm',
    (value) => {
      if (!value) return true;
      return isMatch(value, 'yyyy-MM-dd');
    },
  );
});

const billingsQueryParamsSchema = yup.object().shape({
  query: yup.object({
    page: yup
      .number()
      .typeError('page deve ser do tipo number')
      .integer('page deve ser um número inteiro')
      .positive('page deve ser um número positivo'),
    page_size: yup
      .number()
      .typeError('page_size deve ser do tipo number')
      .integer('page_size deve ser um número inteiro')
      .positive('page_size deve ser um número positivo'),
    status: yup
      .string()
      .strict()
      .matches(validateStatus, 'status devem ser paid ou pending'),
    is_overdue: yup.boolean().typeError('is_overdue deve ser do tipo boolean'),
    due_date: yup.string().validDateFormat(),
    due_date_start: yup.string().validDateFormat(),
    due_date_end: yup.string().validDateFormat(),
    after_due_date: yup.string().validDateFormat(),
    before_due_date: yup.string().validDateFormat(),
    value: yup
      .number()
      .typeError('value deve ser do tipo number')
      .positive()
      .integer(),
    value_lt: yup
      .number()
      .typeError('value_lt deve ser do tipo number')
      .positive()
      .integer(),
    value_gt: yup
      .number()
      .typeError('value_gt deve ser do tipo number')
      .positive()
      .integer(),
    value_start: yup
      .number()
      .typeError('value_start deve ser do tipo number')
      .positive()
      .integer(),
    value_end: yup
      .number()
      .typeError('value_end deve ser do tipo number')
      .positive()
      .integer(),
  }),
});

module.exports = billingsQueryParamsSchema;
