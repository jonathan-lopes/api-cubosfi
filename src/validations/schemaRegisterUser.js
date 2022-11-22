const yup = require('./yupSettings');

const registerUserSchema = yup.object().shape({
  name: yup.string().strict().max(128).required(),
  email: yup.string().email('Formato de e-mail inválido').max(128).required(),
  password: yup.string().min(8).max(56).strict().required(),
});

module.exports = registerUserSchema;
