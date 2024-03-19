const yup = require('./yupSettings');

const customersQueryParamsSchema = yup.object().shape({
  query: yup.object({
    offset: yup
      .number()
      .typeError('offset deve ser do tipo number')
      .integer('offset deve ser um número inteiro')
      .positive('offset deve ser um número positivo'),
    limit: yup
      .number()
      .typeError('limit deve ser do tipo number')
      .integer('limit deve ser um número inteiro')
      .positive('limit deve ser um número positivo'),
  }),
});

module.exports = customersQueryParamsSchema;
