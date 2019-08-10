const express = require('express');
const uuidv4 = require('uuid/v4');
const validateProducto = require('./productos.validate');
const productos = require('../../../db').productos;
const productsRoutes = express.Router();

const logger = require('../../utils/logger');

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