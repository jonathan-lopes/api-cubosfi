require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});
const express = require('express');
const routes = require('./routes/router');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(require('../swagger.json')));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(routes);

module.exports = app;
