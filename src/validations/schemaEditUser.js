const yup = require('./yupSettings');
const { validateCPF, validadePhone } = require('../helpers/regex');

const editUserSchema = yup.object().shape({
  name: yup.string().strict().required().max(128),
  email: yup.string().email('Formato de e-mail inválido').max(128).required(),
  password: yup.string().strict().min(8).max(56),
  cpf: yup
    .string()
    .strict()
    .matches(validateCPF, 'Formato de CPF inválido')
    .nullable(),
  telefone: yup
    .string()
    .strict()
    .matches(validadePhone, 'Fomato de telefone inválido')
    .nullable(),
});

module.exports = editUserSchema;
