require('express-async-errors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const favicon = require('serve-favicon');
const routes = require('./routes/router');
const errorMiddleware = require('./middlewares/error');
const rateLimit = require('./middlewares/rateLimit');
const loadEnviromentVariables = require('./helpers/loadEnviromentVariables');
const morganMiddleware = require('./middlewares/morgan');

require('dotenv').config({
  path: loadEnviromentVariables(),
});

const app = express();

app.use(
  compression({
    threshold: 10 * 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);

app.use(morganMiddleware);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(require('../swagger.json')),
);

app.use(favicon('./public/favicon.ico'));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(...rateLimit);
app.use(routes);
app.use(errorMiddleware);

module.exports = app;
