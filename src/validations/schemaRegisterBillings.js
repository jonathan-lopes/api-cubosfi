const yup = require('./yupSettings');
const { validateStatus } = require('../helpers/regex');

const registerBillingSchema = yup.object().shape({
  customer_id: yup.number().integer().required(),
  description: yup.string().required(),
  status: yup
    .string()
    .matches(validateStatus, 'status devem ser paid ou pending')
    .required(),
  value: yup.number().integer().required(),
  due: yup.date().required(),
});

module.exports = registerBillingSchema;
