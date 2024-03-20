const yup = require('./yupSettings');

const customersQueryParamsSchema = yup.object().shape({
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
  }),
});

module.exports = customersQueryParamsSchema;
