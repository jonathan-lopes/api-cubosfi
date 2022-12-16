const loadEnviromentVariables = () => {
  const env = process.env.NODE_ENV;

  const environmentVariables = {
    test: '.env.test',
    development: '.env.dev',
    production: '.env',
  };

  switch (env) {
    case 'test':
      return environmentVariables.test;
    case 'development':
      return environmentVariables.development;
    case 'production':
      return environmentVariables.production;
    default:
      return environmentVariables.production;
  }
};

module.exports = loadEnviromentVariables;
