const knex = require('../database/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const schemaLogin = require('../validations/schemaLogin');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    await schemaLogin.validate({ email, password });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const user = await knex('users').where({ email }).first();

    if (!user) {
      return res.status(404).json({ message: 'E-mail ou senha inválidos' });
    }

    const pwdCorrect = await bcrypt.compare(password, user.password);

    if (!pwdCorrect) {
      return res.status(400).json({ message: 'E-mail ou senha inválidos' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    const { password: _, ...userLogin } = user;

    return res.status(200).json({ user: userLogin, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = login;
