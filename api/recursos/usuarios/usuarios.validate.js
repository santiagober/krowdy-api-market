const Joi = require('@hapi/joi');

// TODO: Agregar validaciones de JOI al Schema de usuario
const blueprintUsuario = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().regex(/^[+0-9]{1,15}$/).required(),
});

module.exports = (req, res, next) => {
  const joiResult = Joi.validate(req.body, blueprintUsuario);
  if (joiResult.error) { // TODO: Mejorar el mensaje de error.
    res.status(400).send(`Has tenido un error en: ${joiResult.error}`);
    return;
  }
  next();
}
