const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { requests } = require('../config');

const limiter = rateLimit({
  windowMs: requests.rateLimit.window,
  max: requests.rateLimit.max,
  handler: (req, res) => {
    res.status(429).json({
      type: 'manyRequestsError',
      message: {
        error: 'Muitos pedidos. Por favor tente mais tarde.',
      },
      status: 429,
      dateTime: new Date(),
    });
  },
});

const slower = slowDown({
  windowMs: requests.slowDown.window,
  delayAfter: requests.slowDown.delayAfter,
  delayMs: requests.slowDown.delayMs,
});

module.exports = [slower, limiter];
