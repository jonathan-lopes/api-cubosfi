const winston = require('winston');
const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');

const { combine, timestamp, json, errors } = winston.format;

require('winston-daily-rotate-file');

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

const errorFilter = winston.format((info) => {
  return info.level === 'error' ? info : false;
});

const infoFilter = winston.format((info) => {
  return info.level === 'info' ? info : false;
});

const accessFilter = winston.format((info) => {
  return info.level === 'http' ? info : false;
});

const format = combine(errors({ stack: true }), timestamp(), json());

const transports = () => [
  new winston.transports.DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    level: 'error',
    datePattern: 'YYYY-MM',
    maxSize: '20m',
    maxFiles: '15d',
    zippedArchive: true,
    format: errorFilter(),
  }),
  new winston.transports.DailyRotateFile({
    filename: 'logs/access-%DATE%.log',
    level: 'http',
    datePattern: 'YYYY-MM',
    maxSize: '20m',
    maxFiles: '15d',
    format: accessFilter(),
  }),
  new winston.transports.DailyRotateFile({
    filename: 'logs/info-%DATE%.log',
    level: 'info',
    datePattern: 'YYYY-MM',
    maxSize: '20m',
    maxFiles: '15d',
    format: infoFilter(),
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports: transports(),
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console());
}

if (process.env.NODE_ENV === 'production') {
  const logtail = new Logtail(process.env.LOGTAIL_TOKEN);
  logger.add(new LogtailTransport(logtail));
}

module.exports = logger;
