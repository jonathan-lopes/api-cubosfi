const yup = require('./yupSettings');
const { validateStatus } = require('../helpers/regex');

const registerBillingSchema = yup.object().shape({
  customer_id: yup.string().uuid().required(),
  description: yup.string().max(128).required(),
  status: yup
    .string()
    .matches(validateStatus, 'status devem ser paid ou pending')
    .required(),
  value: yup.number().strict().integer().positive().required(),
  due: yup.date().min('1900-01-01').required(),
});

module.exports = registerBillingSchema;
