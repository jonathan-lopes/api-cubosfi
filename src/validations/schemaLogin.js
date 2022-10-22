const yup = require('./yupSettings');

const loginSchema = yup.object().shape({
  email: yup.string().email('Formato de e-mail inválido').max(128).required(),
  password: yup.string().min(8).strict().required(),
});

module.exports = loginSchema;
