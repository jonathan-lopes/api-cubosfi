const env = process.env.NODE_ENV || 'development';

const environmentVariables = {
  test: '.env.test',
  development: '.env.dev',
  production: '.env',
};

module.exports = environmentVariables[env];
