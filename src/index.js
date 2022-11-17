const app = require('./server');
require('./jobs/deleteExpiredRefreshToken');
require('./jobs/verifyBillingsOverdue');

app.listen(process.env.PORT, () =>
  console.log(`🔥 server running at http://localhost:${process.env.PORT}`),
);
