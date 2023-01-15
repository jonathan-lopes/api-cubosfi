const { Router } = require('express');
const verifyLogin = require('../middlewares/verifyLogin');
const userControllers = require('../controllers/usersController');
const customerControllers = require('../controllers/customersController');
const billingControllers = require('../controllers/billingsController');
const loginController = require('../controllers/loginController');
const refreshTokenController = require('../controllers/refreshTokenController');
const methodsAllowed = require('../middlewares/methodsAllowed');

const routes = Router();

routes
  .route('/user')
  .post(userControllers.create)
  .get(verifyLogin, userControllers.get)
  .put(verifyLogin, userControllers.update)
  .all(methodsAllowed(['POST', 'GET', 'PUT']));

routes.all('/login', methodsAllowed(['POST']), loginController);

routes.all('/refresh-token', methodsAllowed(['POST']), refreshTokenController);

routes.use(verifyLogin);

routes
  .route('/customers')
  .post(customerControllers.create)
  .get(customerControllers.getAll)
  .all(methodsAllowed(['POST', 'GET']));

routes
  .route('/customers/:id')
  .get(customerControllers.getOne)
  .put(customerControllers.update)
  .all(methodsAllowed(['GET', 'PUT']));

routes
  .route('/billings')
  .post(billingControllers.create)
  .get(billingControllers.getAll)
  .all(methodsAllowed(['POST', 'GET']));

routes
  .route('/billings/:id')
  .delete(billingControllers.del)
  .get(billingControllers.getOne)
  .put(billingControllers.update)
  .all(methodsAllowed(['DELETE', 'GET', 'PUT']));

module.exports = routes;
