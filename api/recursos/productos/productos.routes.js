const express = require('express');
const uuidv4 = require('uuid/v4');

const tokenValidate = require('../../libs/tokenValidate');
const validateProducto = require('./productos.validate');

const productoController = require('./productos.controller');

const productos = require('../../../db').productos;

const passport = require('passport')
const jwtAuthenticate = passport.authenticate('jwt', { session: false });


const productsRoutes = express.Router();

const logger = require('../../utils/logger');

// /productos/productos
productsRoutes.get('/', (req, res) => {
  productoController.obtenerProductos()
  .then((productos) => {
    logger.info('Se obtuvo todos los productos');
    res.json(productos);
  })
  .catch((err) => {
    res.status(500).send(`Algo ocurrio en la db.`)
  })
  
});

productsRoutes.post('/', [jwtAuthenticate, validateProducto], (req, res) => {
  
  const productoNuevo = { ...req.body, owner: req.user.username };
  
  productoController.crearProducto(productoNuevo)
  .then((producto) => {
    productos.push(producto);
    res.status(201).json(producto);
  })
  .catch((error) => {
    logger.error('Algo ocurrio en la db.')
  })
});

productsRoutes.get('/:id', async (req, res) => {
  try {
    const producto = await productoController.obtenerProducto(req.params.id);
    logger.info(`Se obtuvo el producto con id ${producto.id}`);
    res.json(producto);
  } catch (err) {
    console.log(err);
    res.status(500).send(`Ocurrio algo en la db.`);
  }
});

productsRoutes.put('/:id', validateProducto, async (req, res) => {
  const id = req.params.id;
  try {
    const productoModificado = await productoController.modificarProducto(id, req.body)  
    res.json(productoModificado);
  } catch (err) {
    res.status(500).send(`Error en la db.`)
  }
});

productsRoutes.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const productoEliminado = await productoController.eliminarProducto(id);
    res.json(productoEliminado);
  } catch (err) {
    res.status(500).send(`Ocurrio un error en la db.`); 
  }
});

module.exports = productsRoutes;
