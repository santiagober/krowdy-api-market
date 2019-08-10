const express = require('express');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const validateUsuario = require('./usuarios.validate');
const usuarios = require('../../../db').usuarios;
const usuariosRoutes = express.Router();


usuariosRoutes.get('/', (req, res) => {
  console.log(usuarios);
  res.json(usuarios); 
});

usuariosRoutes.post('/', validateUsuario, (req, res) => {
  
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      // logger.info(error)
      res.status(500).send(`A ocurrido un error en el servidor con bcrypt`);
      return
    }
    
    const newUser = { ...req.body, password: hashedPassword, id: uuidv4() };
    usuarios.push(newUser)
    res.status(201).send(`El usuario fue creado con exito.`);
  });

});

usuariosRoutes.post('/login', validateUsuario, (req, res) => {
  const index = usuarios.findIndex(usuario => usuario.username === req.body.username);
  if (index === -1) {
    res.status(404).send(`El usuario no existe. Verifica tu informacion.`);
    return;
  }
  
  bcrypt.compare(req.body.password, usuarios[index].password, (err, coincide) => {
    if (err) {
      res.status(500).send(`Algo ocurrio ups!`);
      return;
    }
    
    if (coincide) { 
      const token = jwt.sign({id: usuarios[index].id}, 'secreto', { expiresIn: 86400 });
      console.log(token);
      res.status(200).send({token});
    } else {
      res.status(401).send(`Verifica tu password.`);
    }
  });
})

module.exports = usuariosRoutes;