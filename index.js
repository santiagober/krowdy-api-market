const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const logger = require('./api/utils/logger');
const productRouter = require('./api/recursos/productos/productos.routes');
const usuariosRouter = require('./api/recursos/usuarios/usuarios.routes');

const authJWT = require('./api/libs/auth');

const app = express();

app.use(bodyParser.json()); // IMPORTANTE!!!
// stream: message => logger.info(message.trim())
app.use(morgan('common', { stream: logger.stream.write }));
app.use(passport.initialize());

app.use('/usuarios', usuariosRouter);
app.use('/productos', productRouter);

passport.use(authJWT);


// passport.authenticate('jwt', { session: false });
app.get('/', passport.authenticate('jwt', { session: false }), (request, response) => {
  
  console.log(request.user);
  logger.error('Se hizo peticion al /');
  response.send('Hello World');
});
// Nayruth pide 3 pizzas :D*
app.listen(8080, () => {
  console.log('Init server');
});


/*
passport.use(new BasicStrategy((username, password, done) => {
  if (username.valueOf() === 'luis' && password.valueOf() === 'krowdy123') {
    done(null, true);
  } else {
    done(null, false);
  }
}));
*/
