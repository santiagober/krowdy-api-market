const mongoose = require('mongoose');

// TODO: añadir mas validaciones
const productoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Producto debe tener un titulo']
  },
  precio: {
    type: Number,
    min: 0,
    required: [true, 'Producto debe tener un precio']
  },
  moneda: {
    type: String,
    maxlength: 3,
    minlength: 3,
    required: [true, 'Producto debe tener una moneda']
  },
  owner: {
    type: String,
    required: [true, 'Producto debe tener un owner']
  },
});

module.exports = mongoose.model('producto', productoSchema);