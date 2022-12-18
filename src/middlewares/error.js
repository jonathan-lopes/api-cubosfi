const logger = require('../helpers/logger');

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode ?? 500;
  let message = err.statusCode ? err.message : 'Internal Server Error';

  statusCode = err.name === 'ValidationError' ? 400 : statusCode;
  message = err.name === 'ValidationError' ? err.message : message;

  logger.error({
    message: `${req.ip} ${req.get('User-Agent')} ${req.method} ${req.path} ${
      req.user?.id || '-'
    } ${err.constructor.name} ${err.message} ${statusCode}`,
  });

  return res.status(statusCode).json({
    type: err.constructor.name,
    message,
    status: statusCode,
    dateTime: new Date(),
  });
};

module.exports = errorMiddleware;
