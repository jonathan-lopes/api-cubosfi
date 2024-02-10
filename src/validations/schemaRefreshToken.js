const yup = require('./yupSettings');

const refreshTokenSchema = yup.object().shape({
  refresh_token: yup.string().strict().required(),
});

module.exports = refreshTokenSchema;
