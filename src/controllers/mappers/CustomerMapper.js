class CustomerMapper {
  toDomain(persistenceCustomer) {
    return {
      name: persistenceCustomer.name,
      email: persistenceCustomer.email,
      cpf: persistenceCustomer.cpf,
      phone: persistenceCustomer.phone,
      address: persistenceCustomer.address,
    };
  }
}

module.exports = new CustomerMapper();
