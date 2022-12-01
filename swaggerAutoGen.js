const swaggerAutogen = require('swagger-autogen');

swaggerAutogen({ openapi: '3.0.3' })('./swagger.json', [
  './src/routes/router.js',
]);
