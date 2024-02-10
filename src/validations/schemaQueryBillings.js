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

const queryBillingSchema = yup.object().shape({
  query: yup.object({
    status: yup
      .string()
      .strict()
      .matches(validateStatus, 'status devem ser paid ou pending'),
    is_overdue: yup.boolean(),
    due_date: yup.string().validDateFormat(),
    after_due_date: yup.string().validDateFormat(),
    before_due_date: yup.string().validDateFormat(),
    less_than_value: yup.number().positive().integer(),
    greater_than_value: yup.number().positive().integer(),
  }),
});

module.exports = queryBillingSchema;
