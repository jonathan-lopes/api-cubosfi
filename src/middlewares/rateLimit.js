const { rateLimit } = require('express-rate-limit');
const { slowDown } = require('express-slow-down');
const { requests } = require('../config');

const limiter = rateLimit({
  windowMs: requests.rateLimit.window,
  max: requests.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
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
  delayMs: (used) => (used - this.delayAfter) * requests.slowDown.delayMs,
});

module.exports = [slower, limiter];
