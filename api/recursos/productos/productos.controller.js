const Producto = require('./productos.model');

function crearProducto(producto) {
  return new Producto(producto).save();
}

function obtenerProductos() {
  // return new Promise((resolve, rejected) => {
  //   setTimeout(() => {
  //     rejected(new Error);
  //   }, 1000);
  // });
  return Producto.find({});
}

function obtenerProducto(id,regex) {
    return Producto.findById(id); 
}

function obtenerRegEx(producto){
  //1: buscar que contenga // 2: buscar que terminen con// 3: buscar que comiencen con
  if (producto.tipo === 1 ) { return Producto.find({titulo: {$regex: producto.titulo}}).limit(5).sort({"precio": "asc"}); }
  if (producto.tipo === 2 ) { return Producto.find({titulo: {$regex: producto.titulo + '$'}}).limit(5).sort({"precio": "asc"}); }
  if (producto.tipo === 3 ) { return Producto.find({titulo: {$regex: '^'+producto.titulo }}).limit(5).sort({"precio": "asc"}); }
}

function modificarProducto(id, producto) {
  return Producto.findOneAndUpdate({ _id: id}, {
    ...producto
  }, { new: true });
}

function eliminarProducto(id) {
  return Producto.findOneAndDelete(id);
}

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  modificarProducto,
  eliminarProducto,
  obtenerRegEx,
}
