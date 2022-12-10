const {
  validateStatus,
  validateCPFCNPJ,
  validatePhone,
  validateCEP,
} = require('../src/helpers/regex');

describe('Regex', () => {
  it('should not validate a status other than paid or pending', () => {
    expect('pendingg').not.toEqual(expect.stringMatching(validateStatus));
    expect('paidd').not.toEqual(expect.stringMatching(validateStatus));
    expect('foo').not.toEqual(expect.stringMatching(validateStatus));
  });

  it('should validate a pending billing status', () => {
    expect('pending').toEqual(expect.stringMatching(validateStatus));
  });

  it('should validate a paid billing status', () => {
    expect('paid').toEqual(expect.stringMatching(validateStatus));
  });

  it('should validate a valid CPF without a mask', () => {
    expect('57854756007').toEqual(expect.stringMatching(validateCPFCNPJ));
  });

  it('should validate a valid CPF without a mask', () => {
    expect('246.149.990-00').toEqual(expect.stringMatching(validateCPFCNPJ));
  });

  it('should fail CPF is invalid', () => {
    expect('909441940').not.toEqual(expect.stringMatching(validateCPFCNPJ));

    expect('8190.7571.010-57').not.toEqual(
      expect.stringMatching(validateCPFCNPJ),
    );
  });

  it('should validate a phone without a mask', () => {
    expect('83975718336').toEqual(expect.stringMatching(validatePhone));
  });

  it('should validate a phone with a mask', () => {
    expect('(61) 96842-4344').toEqual(expect.stringMatching(validatePhone));
  });

  it('should fail if phone is invalid', () => {
    expect('(99711-5760').not.toEqual(expect.stringMatching(validatePhone));
  });

  it('should fail if cep is invalid', () => {
    expect('79091-2700').not.toEqual(expect.stringMatching(validateCEP));
    expect('5903230000').not.toEqual(expect.stringMatching(validateCEP));
  });

  it('should validate a cep with mask', () => {
    expect('55008-241').toEqual(expect.stringMatching(validateCEP));
  });

  it('should validate a cep without mask', () => {
    expect('29150017').toEqual(expect.stringMatching(validateCEP));
  });
});
