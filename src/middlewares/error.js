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

  logger.error({
    message: `${req.ip} ${req.get('User-Agent')} ${req.method} ${req.path} ${
      req.user?.id || '-'
    } ${err.constructor.name} ${logErrorDescription} ${statusCode}`,
  });

  return res.status(statusCode).json({
    type: err.constructor.name,
    message: apiErrors,
    status: statusCode,
    dateTime: new Date(),
  });
};

module.exports = errorMiddleware;
