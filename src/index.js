const app = require('./server');
const logger = require('./helpers/logger');
require('./jobs/deleteExpiredRefreshToken');
require('./jobs/verifyBillingsOverdue');

app.listen(process.env.PORT, () =>
  logger.info(`🔥 server running at http://localhost:${process.env.PORT}`),
);
