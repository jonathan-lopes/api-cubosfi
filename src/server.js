require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});
require('express-async-errors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes/router');
const errorMiddleware = require('./middleware/error');

const app = express();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(require('../swagger.json')));

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(routes);
app.use(errorMiddleware);

module.exports = app;
