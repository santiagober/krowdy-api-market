const Joi = require('@hapi/joi');

const blueprintProducto = Joi.object().keys({
  titulo: Joi.string().min(3).max(100).required(),
  precio: Joi.number().precision(2).required(),
  moneda: Joi.string().max(3).required(),
});

module.exports = (req, res, next) => {
  const joiResult = Joi.validate(req.body, blueprintProducto);
  if (joiResult.error) { // TODO: Mejorar el mensaje de error.
    res.status(400).send(`Has tenido un error en: ${joiResult.error}`);
    return;
  }
  next();
}
