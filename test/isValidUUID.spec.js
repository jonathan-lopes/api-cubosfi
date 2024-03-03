const isValidUUID = require('../src/helpers/isValidUUID');

describe('is Valid UUID', () => {
  it('should return true if UUID is valid', () => {
    expect(isValidUUID('5a6564c7-cd5d-48c5-ac84-93d4e762463f')).toBeTruthy();
  });

  it('should return false if UUID is invalid', () => {
    expect(
      isValidUUID('31545f6b4c3-9624-4a48-a3b9-f335e07fcb15646746878'),
    ).toBeFalsy();
  });
});
