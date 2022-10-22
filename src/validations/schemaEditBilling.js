const { validateStatus } = require('../helpers/regex');
const yup = require('./yupSettings');

const editBillingSchema = yup.object().shape({
  description: yup.string().required(),
  status: yup
    .string()
    .matches(validateStatus, 'status devem ser paid ou pending')
    .required()
    .default(),
  value: yup.number().integer().required(),
  due: yup.date().required(),
});

module.exports = editBillingSchema;
