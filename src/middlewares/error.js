const logger = require('../helpers/logger');

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode ?? 500;
  let message = err.statusCode ? err.message : 'Internal Server Error';

  const validationErrors = {};
  const queryErrors = {};
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.inner;

    message.forEach((error) => {
      if (!error.path) return;

      const haveQueryError = error.path.includes('query');

      if (haveQueryError) {
        const querypath = error.path.split('.')[1];
        queryErrors[querypath] = error.message;

        validationErrors.query = queryErrors;
      }

      if (!haveQueryError) {
        validationErrors[error.path] = error.message;
      }
    });
  }

  const apiErrors = Object.keys(validationErrors).length
    ? validationErrors
    : { error: message };

  const logErrorDescription =
    statusCode === 500 ? err.message : Object.values(apiErrors);

  const errorMsg = {
    remote_address: req.ip,
    http_version: Number.parseFloat(req.httpVersion),
    user_agent: req.get('User-Agent'),
    method: req.method,
    url: req.path,
    user_id: req.user?.id,
    error_name: err.constructor.name,
    message: logErrorDescription,
    status: statusCode,
  };

  logger.error(errorMsg);

  return res.status(statusCode).json({
    type: err.constructor.name,
    message: apiErrors,
    status: statusCode,
    dateTime: new Date(),
  });
};

module.exports = errorMiddleware;
