/* eslint-disable no-template-curly-in-string */
const yup = require('./yupSettings');
const { validateCPF, validadePhone } = require('../helpers/regex');

const schemaCustomer = yup.object().shape({
  name: yup.string().strict().required(),
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
  address: yup
    .object({
      cep: yup.string().strict().max(9),
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
    })
    .test(
      'is-empty',
      '${path} object is empty',
      (value) => Object.keys(value).length,
    )
    .test(
      'is-aaa',
      '${path} com propriedades não suportadas',
      (value, context) => {
        const keysOriginalValue = Object.keys(value);
        // eslint-disable-next-line no-underscore-dangle
        const nodes = context.schema._nodes;

        for (let i = 0; i < keysOriginalValue.length; i++) {
          if (!nodes.includes(keysOriginalValue[i])) {
            return false;
          }
        }

        return true;
      },
    ),
});

module.exports = schemaCustomer;
