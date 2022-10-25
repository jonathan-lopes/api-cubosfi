const knex = require('../database/connection');
const bcrypt = require('bcrypt');
const schemaRegisterUser = require('../validations/schemaRegisterUser');
const schemaEditUser = require('../validations/schemaEditUser');
const { CrudError, ConflictError } = require('../helpers/apiErrors');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  await schemaRegisterUser.validate({ name, email, password });

  const userEmail = await knex('users').where({ email }).first();

  if (userEmail) {
    throw new ConflictError('E-mail já cadastrado');
  }

  const pwdCrypt = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

  const insertUser = await knex('users').insert({
    name,
    email,
    password: pwdCrypt,
  });

  if (!insertUser) {
    throw new CrudError('Não foi possível cadastrar o usuário');
  }

  return res.status(201).json();
};

const userDetail = async (req, res) => {
  const { user } = req;
  return res.status(200).json(user);
};

const editUser = async (req, res) => {
  const { user } = req;
  const { name, email, cpf, phone, password } = req.body;

  await schemaEditUser.validate({ name, email, cpf, phone, password });

  const userEmail = await knex('users')
    .whereRaw('email = ? AND id <> ?', [email, user.id])
    .first();

  if (userEmail) {
    throw new ConflictError('E-mail já cadastrado');
  }

  const userCpf = await knex('users')
    .whereRaw('cpf = ? AND id <> ?', [cpf, user.id])
    .first();

  if (userCpf) {
    throw new ConflictError('CPF já cadastrado');
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
    throw new CrudError('Não foi possível atualizar o usuário');
  }

  return res.status(204).json();
};

module.exports = { registerUser, userDetail, editUser };
