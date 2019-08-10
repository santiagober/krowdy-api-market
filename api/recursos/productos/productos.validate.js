const Joi = require('@hapi/joi');
const blueprintProducto = Joi.object().keys({
  titulo: Joi.string().min(3).max(100).required().error(() => 'Error: '),
  precio: Joi.number().precision(2).strict().required().error(() => 'Error: '),
  moneda: Joi.string().max(3).required().error(() => 'Error: '),
});


module.exports = (req, res, next) => {
  const joiResult = Joi.validate(req.body, blueprintProducto,{abortEarly: false});
  console.log(joiResult.error)
  let err = []
  let errorMessage = '';
  if (joiResult.error) { // TODO: Mejorar el mensaje de error.    
    joiResult.error.details.forEach(element => {
      err.push({message: element.message,type:element.type,context: element.context})
      errorMessage += `${element.message} ${element.context.label}, tipo de error: ${element.type}, el límite es: ${element.context.limit}, el valor a cambiar: ${element.context.value}\n`     
    })    
    res.status(400).send(errorMessage);
    return;
  }
  next();
}
