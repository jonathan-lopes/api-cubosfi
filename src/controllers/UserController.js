const bcrypt = require('bcrypt');
const knex = require('../database');
const usersRegisterSchema = require('../validations/usersRegisterSchema');
const usersEditSchema = require('../validations/usersEditSchema');
const { DatabaseError, ConflictError } = require('../helpers/apiErrors');

class UserController {
  show(req, res) {
    const { user } = req;
    return res.json(user);
  }

  async store(req, res) {
    const { name, email, password } = req.body;

    await usersRegisterSchema.validate(
      { name, email, password },
      { abortEarly: false },
    );

    const userEmail = await knex('users').where({ email }).first();

    if (userEmail) {
      throw new ConflictError('E-mail já cadastrado');
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
      throw new DatabaseError('Não foi possível cadastrar o usuário');
    }

    return res.sendStatus(201);
  }

  async update(req, res) {
    const { user } = req;
    const { name, email, cpf, phone, password } = req.body;

    await usersEditSchema.validate(
      { name, email, cpf, phone, password },
      { abortEarly: false },
    );

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
      throw new DatabaseError('Não foi possível atualizar o usuário');
    }

    return res.sendStatus(204);
  }
}

module.exports = new UserController();
