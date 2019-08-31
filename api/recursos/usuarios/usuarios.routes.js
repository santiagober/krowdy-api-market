const express = require('express');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const User = require('./usuarios.model');
const jwt = require('jsonwebtoken');

const usuarioController = require('./usuarios.controller');

const validateUsuario = require('./usuarios.validate');
const usuarios = require('../../../db').usuarios;
const usuariosRoutes = express.Router();


usuariosRoutes.get('/', async (req, res) => {
  const usuarios = await usuarioController.obtenerUsuarios();
  res.json(usuarios);
});

usuariosRoutes.post('/', async (req, res) => {
  /*bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      // logger.info(error)
      res.status(500).send(`A ocurrido un error en el servidor con bcrypt`);
      return
    }*/
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      countryCode: req.body.countryCode,
      password: req.body.password,
    });
    user.save(function(err, doc) {
      if (err) {
          //req.flash('errors', 'There was a problem creating your'+ ' account - note that all fields are required. Please'+ ' double-check your input and try again.');
          res.status(500).send(`Hubo un problema al crear su cuenta, verifica que los datos sean correctos`);
          return;
          //res.redirect('/users/new');
      } else {
          user.sendAuthyToken(function(err) {
              if (err) {
                  //req.flash('errors', 'There was a problem sending '+ 'your token - sorry :(');
                  res.status(500).send(`Hay un problema al enviar tu token`);
                  return;
              }
              res.status(201).send(`se envio codigo a su celular.`);
          });
      }
  });
    // todo hacer catch
    /*try{
      let usuario = await usuarioController.obtenerUsuario(req.body);
      if (usuario){
        res.status(401).send(`Telefono ya existe!!!`);
        return;
      }
      const newUser = { ...req.body, password: hashedPassword, id: uuidv4() };
      usuario = await usuarioController.crearUsuario(newUser);
      res.status(201).send(`El usuario fue creado con exito.`);
    }catch(error){

    }
  });*/

});

usuariosRoutes.post('/login', async (req, res) => {
  const usuario = await usuarioController.obtenerUsuario(req.body)
  console.log(usuario)
  if (!usuario) {
    res.status(404).send(`El usuario no existe. Verifica tu informacion.`);
    return;
  }
  
  bcrypt.compare(req.body.password, usuario.password, (err, coincide) => {
    if (err) {
      console.log(err);
      res.status(500).send(`Algo ocurrio ups!`);
      return;
    }
    
    if (coincide) { 
      const token = jwt.sign({id: usuario['_id']}, 'secreto', { expiresIn: 86400 });
      res.status(200).send({token});
    } else {
      res.status(401).send(`Verifica tu password.`);
    }
  });
})

usuariosRoutes.post('/verificar', async (req, res) => {
  let user = {};

    // Load user model
    User.findById(req.body.id, function(err, doc) {
        if (err || !doc) {
          res.status(401).send(`Usuario no encontrado.`);
        }

        // If we find the user, let's validate the token they entered
        user = doc;
        user.verifyAuthyToken(req.body.code, postVerify);
    });

    // Handle verification response
    function postVerify(err) {
        if (err) {
          res.status(401).send(`Token invalido.`);
        }

        // If the token was valid, flip the bit to validate the user account
        user.verified = true;
        user.save(postSave);
    }

    // after we save the user, handle sending a confirmation
    function postSave(err) {
        if (err) {
            //return die('There was a problem validating your account '
                //+ '- please enter your token again.');
            res.status(401).send(`Hubo un problema al verificar, intentalo otra vez.`);
        }

        // Send confirmation text message
        const message = 'Felicitaciones, verificacion completada :)';
        user.sendMessage(message, function() {
          // show success page
          //request.flash('successes', message);
          //response.redirect(`/users/${user._id}`);
          res.status(200).send(`Verificacion completada.`);
        }, function(err) {
          /*request.flash('errors', 'You are signed up, but '
              + 'we could not send you a message. Our bad :(');*/
              res.status(401).send(`Ya estas registrado, pero no se pudo enviar mensaje.`);
        });
    }

    // respond with an error
    function die(message) {
        request.flash('errors', message);
        response.redirect('/users/'+request.params.id+'/verify');
    }
});

module.exports = usuariosRoutes;