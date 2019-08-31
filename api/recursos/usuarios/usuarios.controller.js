const Usuario = require('./usuarios.model');

function crearUsuario(user) {
  return new Usuario(user).save();
}

function obtenerUsuarios() {
  return Usuario.find({});
}

function obtenerUsuario(user) {
    var usuario ;
    if (user.phone) {
      usuario = Usuario.findOne({ phone: user.phone, $where: function(){
        return this.username !== user.username;
      }});
      return usuario;
    }
    if (user.username) {
      usuario = Usuario.findOne({ username: user.username});
      return usuario;
    }
    if (user.id) {
      usuario = Usuario.findById(id);
      return usuario;
    }
}



module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuario,
}
