const { Router } = require('express');
const verifyLogin = require('../middlewares/verifyLogin');
const UserController = require('../controllers/UserController');
const CustomerController = require('../controllers/CustomerController');
const BillingController = require('../controllers/BillingController');
const loginController = require('../controllers/loginController');
const refreshTokenController = require('../controllers/refreshTokenController');
const methodsAllowed = require('../middlewares/methodsAllowed');
const pagination = require('../middlewares/pagination');

const routes = Router();

routes
  .route('/user')
  .post(UserController.store)
  .get(verifyLogin, UserController.show)
  .put(verifyLogin, UserController.update)
  .all(methodsAllowed(['POST', 'GET', 'PUT']));

routes.all('/login', methodsAllowed(['POST']), loginController);

routes.all('/refresh-token', methodsAllowed(['POST']), refreshTokenController);

routes.use(verifyLogin);

routes
  .route('/customers')
  .post(CustomerController.store)
  .get(pagination('customers'), CustomerController.index)
  .all(methodsAllowed(['POST', 'GET']));

routes
  .route('/customers/:id')
  .get(CustomerController.show)
  .put(CustomerController.update)
  .all(methodsAllowed(['GET', 'PUT']));

routes
  .route('/billings')
  .post(BillingController.store)
  .get(pagination('billings'), BillingController.index)
  .all(methodsAllowed(['POST', 'GET']));

routes
  .route('/billings/:id')
  .delete(BillingController.delete)
  .get(BillingController.show)
  .put(BillingController.update)
  .all(methodsAllowed(['DELETE', 'GET', 'PUT']));

module.exports = routes;
