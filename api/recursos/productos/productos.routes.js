const express = require('express');
const uuidv4 = require('uuid/v4');
const validateProducto = require('./productos.validate');
const productos = require('../../../db').productos;
const logger = require('../../utils/logger');

const productsRoutes = express.Router();

const blueprintProducto = Joi.object().keys({
  titulo: Joi.string().min(3).max(100).required().error(() => 'Error: '),
  precio: Joi.number().precision(2).strict().required().error(() => 'Error: '),
  moneda: Joi.string().max(3).required().error(() => 'Error: '),
});
function validateProducto(req, res, next) {
  const joiResult = Joi.validate(req.body, blueprintProducto,{abortEarly: false});
  console.log(joiResult.error)
  let err = []
  let errorMessage = '';
  if (joiResult.error) { // TODO: Mejorar el mensaje de error.    
    joiResult.error.details.forEach(element => {
      err.push({message: element.message,type:element.type,context: element.context})
      errorMessage += `${element.message} ${element.context.label}, tipo de error: ${element.type}, el límite es: ${element.context.limit}, el valor a cambiar: ${element.context.value}\n`     
    })
    console.log(errorMessage)
    res.status(400).send(errorMessage);
    return;
  }
  next();
}


// /productos/productos
productsRoutes.get('/', (req, res) => {
  logger.info('Se obtuvo todos los productos');
  res.json(productos);
});

productsRoutes.post('/', validateProducto, (req, res) => {
  const productoNuevo = { ...req.body, id: uuidv4() };
  productos.push(productoNuevo);
  res.status(201).json(productoNuevo);
});

productsRoutes.get('/:id', (req, res) => {
  // TODO: Implementar el 404
  let productoFilter;
  productos.forEach(producto => {
    if (producto.id === req.params.id) {
      productoFilter = producto;
    }
  });
  logger.info(`Se obtuvo el producto con id ${productoFilter.id}`);
  // productos.filter(producto => producto.id === req.params.id);
  res.json(productoFilter);
});

productsRoutes.put('/:id', validateProducto, (req, res) => {
  const id = req.params.id;
  let index;
  let productoFilter;
  productos.forEach((producto, i) => {
    if (producto.id === id) {
      index = i;
      productoFilter = producto;
    }
  });

  productos[index] = { ...productoFilter, ...req.body };
  res.json(productos[index]);
});

productsRoutes.delete('/:id', (req, res) => {
  const id = req.params.id;

  let index;
  let productoFilter;
  productos.forEach((producto, i) => {
    if (producto.id === id) {
      index = i;
      productoFilter = producto;
    }
    
    
  });
    
  productos.splice(index, 1);
  res.json(productoFilter);
});
//hola masco
module.exports = productsRoutes;