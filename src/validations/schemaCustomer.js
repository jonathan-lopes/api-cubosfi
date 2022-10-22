const yup = require('./yupSettings');
const { validateCPF, validadePhone } = require('../helpers/regex');

const schemaCustomer = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email('Formato de e-mail inválido').required(),
  cpf: yup
    .string()
    .strict()
    .matches(validateCPF, 'Formato de CPF inválido')
    .required(),
  phone: yup
    .string()
    .strict()
    .matches(validadePhone, 'Fomato de telefone inválido')
    .required(),
  cep: yup.string(),
  address: yup.string(),
  complement: yup.string(),
  district: yup.string(),
  city: yup.string(),
  uf: yup.string(),
});

module.exports = schemaCustomer;
