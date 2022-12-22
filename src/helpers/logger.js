const winston = require('winston');
require('winston-mongodb');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:msZ' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

const transports = () => {
  const loggers = [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/access.log', level: 'http' }),
    new winston.transports.File({ filename: 'logs/all.log' }),
  ];

  if (process.env.NODE_ENV !== 'test') {
    const mongoLogger = new winston.transports.MongoDB({
      db: process.env.MONGO_DB,
      level: 'error',
      dbName: 'cubosfi',
      tryReconnect: true,
      collection: 'logs',
      decolorize: true,
      options: { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 2 },
    });

    return [...loggers, mongoLogger];
  }

  return loggers;
};

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports: transports(),
});

module.exports = logger;
