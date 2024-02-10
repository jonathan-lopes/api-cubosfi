const morgan = require('morgan');
const logger = require('../helpers/logger');

const stream = {
  write: (message) => logger.http(message),
};

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

morgan.token('id', (req) => (req.user?.id ? req.user.id : '-'));

const morganMiddleware = morgan(
  ':remote-addr :user-agent userID :id :method :url :status :res[content-length] - :response-time ms',
  { stream, skip },
);

module.exports = morganMiddleware;
