const bcrypt = require('bcrypt');
const knex = require('../database');
const usersRegisterSchema = require('../validations/usersRegisterSchema');
const usersEditSchema = require('../validations/usersEditSchema');
const { DatabaseError, ConflictError } = require('../helpers/apiErrors');
const UserMapper = require('./mappers/UserMapper');

class UserController {
  show(req, res) {
    const { user } = req;
    return res.json(user);
  }

  async store(req, res) {
    const dataDomain = UserMapper.toDomain(req.body);

    await usersRegisterSchema.validate(dataDomain, { abortEarly: false });

    const userEmail = await knex('users')
      .where({ email: dataDomain.email })
      .first();

    if (userEmail) {
      throw new ConflictError('E-mail já cadastrado');
    }

    const pwdCrypt = await bcrypt.hash(
      dataDomain.password,
      Number(process.env.SALT_ROUNDS),
    );

    const insertUser = await knex('users').insert({
      ...dataDomain,
      password: pwdCrypt,
    });

    if (!insertUser) {
      throw new DatabaseError('Não foi possível cadastrar o usuário');
    }

    return res.sendStatus(201);
  }

  async update(req, res) {
    const { user } = req;
    const dataDomain = UserMapper.toDomain(req.body);

    await usersEditSchema.validate(dataDomain, { abortEarly: false });

    const userEmail = await knex('users')
      .whereRaw('email = ? AND id <> ?', [dataDomain.email, user.id])
      .first();

    if (userEmail) {
      throw new ConflictError('E-mail já cadastrado');
    }

    const userCpf = await knex('users')
      .whereRaw('cpf = ? AND id <> ?', [dataDomain.cpf, user.id])
      .first();

    if (userCpf) {
      throw new ConflictError('CPF já cadastrado');
    }

    if (dataDomain.password) {
      const pwdCrypt = await bcrypt.hash(
        dataDomain.password,
        Number(process.env.SALT_ROUNDS),
      );

      dataDomain.password = pwdCrypt;
    }

    const updateUser = await knex('users')
      .update(dataDomain)
      .where({ id: user.id });

    if (!updateUser) {
      throw new DatabaseError('Não foi possível atualizar o usuário');
    }

    return res.sendStatus(204);
  }
}

module.exports = new UserController();
