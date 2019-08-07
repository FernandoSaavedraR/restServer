const express = require("express");
const app = express();
const { verificaToken } = require("../middlewares/authentication");
const _ = require("underscore");
let Producto = require("../models/producto");

app.get("/productos", verificaToken, (req, res) => {
  let condicionesBusqueda = { disponible: true };
  let limit = Number(req.query.limit) || 5;
  let from = Number(req.query.from) || 0;
  //.log(limit, from);
  Producto.find(condicionesBusqueda)
    .sort("nombre")
    .populate({
      path: "categoria",
      populate: { path: "usuario", select: " email nombre" }
    })
    .populate("usuario", "nombre email")
    .limit(limit)
    .skip(from)
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      Producto.countDocuments(condicionesBusqueda, (err, cuenta) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }
        res.json({
          ok: true,
          cuenta,
          productos
        });
      });
    });
});
app.get("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  Producto.findById(id)
    .populate({
      path: "categoria",
      populate: { path: "usuario", select: " email nombre" }
    })
    .populate("usuario", "nombre email")
    .exec((err, Producto) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!Producto) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        Producto
      });
    });
});
app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
  let termino = req.params.termino
  let regex = new RegExp(termino,'i')
  
  Producto.find({nombre:regex})
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      res.json({
        ok:true,
        productos
      })
    });
});
app.post("/productos", verificaToken, (req, res) => {
  let usuario = req.usuario;
  let body = req.body;
  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: usuario
  });
  producto.save((err, producto) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    res.status(201).json({
      ok: true,
      producto
    });
  });
});

app.put("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, [
    "nombre",
    "precioUni",
    "descripcion",
    "categoria",
    "disponible"
  ]);
  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, Producto) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!Producto) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "No existe el producto"
          }
        });
      }
      res.json({
        ok: true,
        Producto
      });
    }
  );
});

app.delete("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let producto = {
    disponible: false
  };
  Producto.findByIdAndUpdate(
    id,
    producto,
    { new: true, runValidators: true },
    (err, Producto) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        message: "Producto deshabilitado"
      });
    }
  );
});
module.exports = app;
