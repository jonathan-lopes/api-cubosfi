const { MethodNotImplementedError } = require('../helpers/apiErrors');

const methodsAllowed =
  (methods = ['GET']) =>
  (req, res, next) => {
    if (methods.includes(req.method)) return next();

    let allowed = '';

    for (let i = 0; i < methods.length; i++) {
      allowed += methods[i] + (i === methods.length - 1 ? '' : ', ');
    }

    res.set('Allow', allowed);

    throw new MethodNotImplementedError('Método não é suportado');
  };

module.exports = methodsAllowed;
