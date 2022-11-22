const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode ?? 500;
  const message = err.statusCode ? err.message : 'Internal Server Error';
  statusCode = err.name === 'ValidationError' ? 400 : statusCode;

  return res.status(statusCode).json({
    type: err.constructor.name,
    message: err.name === 'ValidationError' ? err.message : message,
    status: statusCode,
    dateTime: new Date(),
  });
};

module.exports = errorMiddleware;
