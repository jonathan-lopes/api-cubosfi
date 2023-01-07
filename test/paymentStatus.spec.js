const paymentStatus = require('../src/helpers/paymentStatus');

describe('Payment Status', () => {
  it('should return true if is overdue', () => {
    expect(paymentStatus.isOverdue('2021-10-05', 'pending')).toBe(true);
  });

  it('should return true if charge is pending', () => {
    const date = new Date();

    expect(
      paymentStatus.isPending(`${date.getFullYear() + 1}-10-05`, 'pending'),
    ).toBe(true);
  });

  it('should return false if the charge is not pending', () => {
    expect(paymentStatus.isPending('2021-05-05', 'paid'));
  });
});
