const { Router } = require('express');
const verifyLogin = require('../middleware/verifyLogin');
const userControllers = require('../controllers/usersController');
const customerControllers = require('../controllers/customersController');
const billingControllers = require('../controllers/billingsController');
const loginController = require('../controllers/loginController');

const routes = Router();

routes.post('/user', userControllers.create);
routes.post('/login', loginController);

routes.use(verifyLogin);

routes.get('/user', userControllers.getUser);
routes.put('/user', userControllers.update);

routes.post('/customer', customerControllers.create);
routes.get('/customers', customerControllers.getAll);
routes.get('/customer/:id', customerControllers.getOne);
routes.put('/customer/:id', customerControllers.update);

routes.post('/billing', billingControllers.create);
routes.get('/billings', billingControllers.getAll);
routes.delete('/billing/:id', billingControllers.del);
routes.get('/billing/:id', billingControllers.getOne);
routes.put('/billing/:id', billingControllers.update);

module.exports = routes;
