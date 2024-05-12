class BillingMapper {
  toDomain(persistenceBilling) {
    return {
      customer_id: persistenceBilling.customer_id,
      description: persistenceBilling.description,
      status: persistenceBilling.status,
      value: persistenceBilling.value,
      due: persistenceBilling.due,
    };
  }
}

module.exports = new BillingMapper();
