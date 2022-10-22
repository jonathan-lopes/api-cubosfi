const knex = require('../database/connection');
const bcrypt = require('bcrypt');
const schemaRegisterUser = require('../validations/schemaRegisterUser');
const schemaEditUser = require('../validations/schemaEditUser');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await schemaRegisterUser.validate({ name, email, password });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const userEmail = await knex('users').where({ email }).first();

    if (userEmail) {
      return res.status(400).json({ message: 'E-mail já cadastrado' });
    }

    const pwdCrypt = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS),
    );

    const insertUser = await knex('users').insert({
      name,
      email,
      password: pwdCrypt,
    });

    if (!insertUser) {
      return res
        .status(500)
        .json({ message: 'Não foi possível cadastrar o usuário' });
    }

    return res.status(201).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const userDetail = async (req, res) => {
  const { user } = req;
  return res.status(200).json(user);
};

const editUser = async (req, res) => {
  const { user } = req;
  const { name, email, cpf, phone, password } = req.body;

  try {
    await schemaEditUser.validate({ name, email, cpf, phone, password });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const userEmail = await knex('users')
      .whereRaw('email = ? AND id <> ?', [email, user.id])
      .first();

    if (userEmail) {
      return res.status(400).json({ message: 'E-mail já cadastrado' });
    }

    const userCpf = await knex('users')
      .whereRaw('cpf = ? AND id <> ?', [cpf, user.id])
      .first();

    if (userCpf) {
      return res.status(400).json({ message: 'CPF já cadastrado' });
    }

    const body = {
      name,
      email,
      cpf,
      phone,
    };

    if (password) {
      const pwdCrypt = await bcrypt.hash(
        password,
        Number(process.env.SALT_ROUNDS),
      );

      body.password = pwdCrypt;
    }

    const updateUser = await knex('users').update(body).where({ id: user.id });

    if (!updateUser) {
      return res
        .status(500)
        .json({ message: 'Não foi possível atualizar o usuário' });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, userDetail, editUser };
