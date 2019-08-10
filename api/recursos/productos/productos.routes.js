const express = require('express');
const uuidv4 = require('uuid/v4');
const validateProducto = require('./productos.validate');
const productos = require('../../../db').productos;
const logger = require('../../utils/logger');

const productsRoutes = express.Router();
const tokenValidate = require('../../../api/libs/token.validate')

// /productos/productos
productsRoutes.get('/',tokenValidate ,(req, res) => {
  logger.info('Se obtuvo todos los productos');
  res.json(productos);
});

productsRoutes.post('/', tokenValidate ,validateProducto, (req, res) => {
  const productoNuevo = { ...req.body, id: uuidv4() };
  productos.push(productoNuevo);
  res.status(201).json(productoNuevo);
});

productsRoutes.get('/:id', tokenValidate,(req, res) => {  
  // TODO: Implementar el 404
  const id = req.params.id;
  let productoFilter;
  productos.forEach(producto => {
    if (producto.id === id) {
      productoFilter = producto;
    }
  });
  const index = productos.findIndex(productos => productos.id === id);
  if (index === -1) {
    logger.error(` No se encuentra el producto${id}`);
    res.status(404).send(`El producto no existe. Verifica id ${id}`);
    return;
  }  
  logger.info(`Se obtuvo el producto con id ${productoFilter.id}`);
  // productos.filter(producto => producto.id === req.params.id);
  res.json(productoFilter);
});

productsRoutes.put('/:id', [validateProducto,tokenValidate], (req, res) => {
  const id = req.params.id;
  let index;
  let productoFilter;
  productos.forEach((producto, i) => {
    if (producto.id === id) {
      index = i;
      productoFilter = producto;
    }
  });
  const indexID = productos.findIndex(productos => productos.id === id);
  if (indexID === -1) {
    logger.error(`No se encuentra el producto${id}`);
    res.status(404).send(`El producto no existe. Verifica id ${id}`);
    return;
  }
  // if(!productoFilter){
  //   logger.error(`Se obtuvo el producto con id ${id}`);
  //   res.status(404).send('No existe producto')
  //   return
  // }
  productos[index] = { ...productoFilter, ...req.body };
  res.json(productos[index]);
});

productsRoutes.delete('/:id', tokenValidate,(req, res) => {
  const id = req.params.id;

  let index;
  let productoFilter;
  productos.forEach((producto, i) => {
    if (producto.id === id) {
      index = i;
      productoFilter = producto;
    } 
    
  });
  const indexID = productos.findIndex(productos => productos.id === id);
   if (indexID === -1) {
    logger.error(`No se encuentra el producto${id}`);
    res.status(404).send(`El producto no existe. Verifica id ${id}`);
    return;
  }  
  productos.splice(index, 1);
  res.json(productoFilter);
});
//hola masco
module.exports = productsRoutes;