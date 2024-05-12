class UserMapper {
  toDomain(persistenceUser) {
    return {
      name: persistenceUser.name,
      email: persistenceUser.email,
      password: persistenceUser.password,
      cpf: persistenceUser.cpf ?? null,
      phone: persistenceUser.phone ?? null,
    };
  }
}

module.exports = new UserMapper();
