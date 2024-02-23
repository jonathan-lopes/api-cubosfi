const morgan = require('morgan');
const logger = require('../helpers/logger');

const stream = {
  write: (message) => {
    const data = JSON.parse(message);
    logger.http(`incoming-request`, data);
  },
};

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

morgan.token('id', (req) => req.user?.id);

const morganMiddleware = morgan(
  (tokens, req, res) =>
    JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      content_length: tokens.res(req, res, 'content-length'),
      response_time_ms: Number.parseFloat(tokens['response-time'](req, res)),
      user_id: tokens.id(req, res),
      remote_address: tokens['remote-addr'](req, res),
      user_agent: tokens['user-agent'](req, res),
    }),
  { stream, skip },
);

module.exports = morganMiddleware;
