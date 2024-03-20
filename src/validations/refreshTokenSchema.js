const yup = require('./yupSettings');

const refreshTokenSchema = yup.object().shape({
  refresh_token: yup
    .string()
    .typeError('refresh_token deve ser do tipo string')
    .strict()
    .required(),
});

module.exports = refreshTokenSchema;
