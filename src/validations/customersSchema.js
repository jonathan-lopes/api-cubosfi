const yup = require('./yupSettings');
const {
  validateCPFCNPJ,
  validatePhone,
  validateCEP,
} = require('../helpers/regex');

const customersSchema = yup.object().shape({
  name: yup.string().strict().max(80).required(),
  email: yup.string().max(80).email('Formato de e-mail inválido').required(),
  cpf: yup
    .string()
    .strict()
    .matches(validateCPFCNPJ, 'Formato de CPF inválido')
    .required(),
  phone: yup
    .string()
    .strict()
    .matches(validatePhone, 'Formato de telefone inválido')
    .required(),
  address: yup.object({
    cep: yup
      .string()
      .strict()
      .matches(validateCEP, 'Formato de address.cep inválido'),
    street: yup.string().strict(),
    complement: yup.string().strict(),
    district: yup.string().strict(),
    city: yup.string().strict(),
    uf: yup
      .string()
      .strict()
      .matches(/^[A-Z]{2}$/gm, {
        excludeEmptyString: true,
        message: 'address.uf deve ter exatamente 2 caracteres em maiúsculo',
      }),
  }),
});

module.exports = customersSchema;
