const express = require('express');
const uuidv4 = require('uuid/v4');

const tokenValidate = require('../../libs/tokenValidate');
const validateProducto = require('./productos.validate').validateProducto;
const validateProductoSearch = require('./productos.validate').validateProductoSearch;

const productoController = require('./productos.controller');

const ProductoNoExiste = require('./productos.error').ProductoNoExiste;

const procesarError = require('../../libs/errorHandler').procesarError;

const productos = require('../../../db').productos;

const passport = require('passport')
const authJWT = require('./../../libs/auth');

passport.use(authJWT);
const jwtAuthenticate = passport.authenticate('jwt', { session: false });


const productsRoutes = express.Router();

const logger = require('../../utils/logger');

// /productos
productsRoutes.get('/', procesarError((req, res) => {
  console.log('DENTRO DEL PROCESO')
  return productoController.obtenerProductos()
    .then((productos) => {
      logger.info('Se obtuvo todos los productos');
      res.json(productos);
    })
}));

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

productsRoutes.get('/:id', procesarError((req, res) => {
  const id = req.params.id;
  return productoController.obtenerProducto(id)
    .then(producto => {
      console.log('producto', producto);
      if (!producto) throw new ProductoNoExiste(`El producto con id [${id}] no existe`);
      res.json(producto);
    })
  logger.info(`Se obtuvo el producto con id ${producto.id}`);
  res.json(producto);

}));

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

productsRoutes.post('/search',[jwtAuthenticate,validateProductoSearch], procesarError((req, res) => {
  return productoController.obtenerRegEx(req.body)
    .then(producto => {
      if (!producto) throw new ProductoNoExiste(`No existen coincidencias!!!`);
      res.json(producto);
    })
    .catch((error) => {
      logger.error('Algo ocurrio en la db.')
    })
}));

module.exports = productsRoutes;
