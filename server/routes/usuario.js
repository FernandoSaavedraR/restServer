const express = require("express");
const app = express();
const Usuario = require("../models/usuario");
const {verificaToken,verificaRole} = require('../middlewares/authentication')
const bcrypt = require("bcrypt");
const _ = require("underscore");
//pedir datos
app.get("/usuario",verificaToken, function(req, res) {
 
  let from = Number(req.query.from) || 0;
  let limit = Number(req.query.limit) || 5;
  let condicionesBusqueda ={estado:true}
  Usuario.find(condicionesBusqueda, "nombre email role estado google img")
    .skip(from)
    .limit(limit)
    .exec((err, usuarios) => {
      if (err)
        return res.status(400).json({
          ok: false,
          err
        });

      Usuario.countDocuments(condicionesBusqueda, (err, conteo) => {
        if (err)
          return res.status(400).json({
            ok: false,
            err
          });
        res.json({ ok: true, conteo, solicita:{
          ...req.usuario
        }, usuarios });
      });
    });
});

//mandar datos
app.post("/usuario",[verificaToken,verificaRole], function(req, res) {
  let body = req.body;
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });
  usuario.save((err, usuarioDB) => {
    if (err)
      return res.status(400).json({
        ok: false,
        err
      });
    //usuarioDB.password= null
    res.json({ ok: true, usuarioDB });
  });
});

//actualizar datos
app.put("/usuario/:id",[verificaToken,verificaRole], function(req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);
  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err)
        return res.status(400).json({
          ok: false,
          err
        });
      res.json({ ok: true, usuarioDB });
    }
  );
});
app.delete("/usuario/:id",[verificaToken,verificaRole], function(req, res) {
  let id = req.params.id;
  let cambiaEstado ={
    estado:false
  }
  Usuario.findByIdAndUpdate(id,cambiaEstado,{ new: true}, (err, usuarioBorrado) => {
    if (err)
    return res.status(400).json({
        ok: false,
        err
      });
      if(!usuarioBorrado){
        return res.status(400).json({
        ok: false,
        err:{
          message: 'Usuario no encontrado'
        }
      });
    }
    res.json({
      ok:true,
      usuario:usuarioBorrado
    })
  });
});

module.exports = app;

/*============================funciones extra================================*/
//"borrar" (cambiar estado) de los datos
// app.delete("/usuario/:id", function(req, res) {
//   let id = req.params.id;
//   Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
//     if (err)
//       return res.status(400).json({
//         ok: false,
//         err
//       });
//     if(!usuarioBorrado){
//       return res.status(400).json({
//         ok: false,
//         err:{
//           message: 'Usuario no encontrado'
//         }
//       });
//     }
//       res.json({
//         ok:true,
//         usuario:usuarioBorrado
//       })
//   });
// });