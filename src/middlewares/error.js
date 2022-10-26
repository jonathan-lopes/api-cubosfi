const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.statusCode ? err.message : 'Internal Server Error';

  return res.status(err.name === 'ValidationError' ? 400 : statusCode).json({
    message: err.name === 'ValidationError' ? err.message : message,
  });
};

module.exports = errorMiddleware;
