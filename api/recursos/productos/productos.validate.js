const Joi = require('@hapi/joi');

const blueprintProducto = Joi.object().keys({
  titulo: Joi.string().min(3).max(100).required(),
  precio: Joi.number().precision(2).required(),
  moneda: Joi.string().max(3).required(),
  owner: Joi.string().required(),
});
const blueprintProductoSearch = Joi.object().keys({
  titulo: Joi.string().min(3).max(100).required(),
  tipo: Joi.number().required(),
});

function validateProducto(req, res, next) {
  const joiResult = Joi.validate(req.body, blueprintProducto);
  if (joiResult.error) { // TODO: Mejorar el mensaje de error.
    res.status(400).send(`Has tenido un error en: ${joiResult.error}`);
    return;
  }
  next();
}

function validateProductoSearch (req, res, next) {
  const joiResultSearch = Joi.validate(req.body, blueprintProductoSearch);
  console.log(joiResultSearch);
  if (joiResultSearch.error) { // TODO: Mejorar el mensaje de error.
    res.status(400).send(`Has tenido pues un error en: ${joiResultSearch.error}`);
    return;
  }
  next();
}

module.exports = 
{
  validateProducto,
  validateProductoSearch,
}
