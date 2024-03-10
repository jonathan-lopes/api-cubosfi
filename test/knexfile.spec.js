const { onUpdateTrigger } = require('../knexfile');

describe('Test the construction of the trigger to update the table', () => {
  it('should return the creation of the sql trigger with the name of the table that users', () => {
    expect(onUpdateTrigger('users')).toMatch(/users/);
  });
});
