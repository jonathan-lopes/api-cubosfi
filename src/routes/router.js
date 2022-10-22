const { Router } = require('express');
const verifyLogin = require('../middleware/verifyLogin');
const userControllers = require('../controllers/users');
const customerControllers = require('../controllers/customers');
const billingControllers = require('../controllers/billings');
const login = require('../controllers/login');

const routes = Router();

routes.post('/user', userControllers.registerUser);
routes.post('/login', login);

routes.use(verifyLogin);

routes.get('/user', userControllers.userDetail);
routes.put('/user', userControllers.editUser);

routes.post('/customer', customerControllers.registerCustomer);
routes.get('/customers', customerControllers.listCustomers);
routes.get('/customer/:id', customerControllers.detailCustomer);
routes.put('/customer/:id', customerControllers.updateCustomer);

routes.post('/billing', billingControllers.registerBilling);
routes.get('/billings', billingControllers.listBillings);
routes.delete('/billing/:id', billingControllers.deleteBilling);
routes.get('/billing/:id', billingControllers.detailBilling);
routes.put('/billing/:id', billingControllers.editBilling);

module.exports = routes;
