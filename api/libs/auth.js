const passport = require('passport');
const passportJWT = require('passport-jwt');
const usuarios = require('../../db').usuarios;

const configJWT = {
  secretOrKey: 'secreto',
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
}

let jwtStrategy = new passportJWT.Strategy(configJWT, (jwtPayload, next) => {
  const usuarioLogeado = usuarios.filter(usuario => usuario.id === jwtPayload.id)
  
  next(null, {
    id: usuarioLogeado.id,
    username: usuarioLogeado.name,
  });
})

module.exports = jwtStrategy;