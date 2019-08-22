const Usuario = require('./usuarios.model');

function crearUsuario(user) {
  return new Usuario(user).save();
}

function obtenerUsuarios() {
  return Usuario.find({});
}

function obtenerUsuario(username, id) {
    if (username) return Usuario.findOne({ username: username});
    if (id) return Usuario.findById(id);
}



module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuario,
}
