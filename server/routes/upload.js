const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const fs = require("fs");
const path = require("path");
//
app.use(fileUpload({ useTempFiles: true }));

app.put("/upload/:tipo/:id", (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files)
    return res.status(400).json({
      ok: false,
      err: {
        message: "No files were uploaded"
      }
    });
  let archivo = req.files.archivo;
  // validar tipo
  const tiposValidos = ["productos", "usuarios"];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `las extensiones permitidas son: ${tiposValidos.join(", ")}`,
        tipo
      }
    });
  }
  //extensiones permitidas
  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];
  let nombreArchivo = archivo.name.split(".");
  ////console.log(nombreArchivo);
  let extension = nombreArchivo[nombreArchivo.length - 1];
  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `las extensiones permitidas son ${extensionesValidas.join(
          ", "
        )}`,
        ext: extension
      }
    });
  }
  //cambiar nombre al archivo para evitar redundancia
  let nombreSend = `${id}-${new Date().getMilliseconds()}.${extension}`;
  archivo.mv(`uploads/${tipo}/${nombreSend}`, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (tipo === "usuarios") {
      imagenUsuario(id, res, nombreSend);
    } else {
      imagenProducto(id, res, nombreSend);
    }
  });
});

function imagenUsuario(id, res, nombreSend) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borraArchivo(nombreSend, "usuarios");
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!usuarioDB) {
      borraArchivo(nombreSend, "usuarios");
      return res.status(400).json({
        ok: false,
        err: {
          message: "El usuario no existe"
        }
      });
    }
    borraArchivo(usuarioDB.img, "usuarios");
    usuarioDB.img = nombreSend;
    usuarioDB.save((err, UsuarioGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      res.json({
        Usuario: UsuarioGuardado,
        img: nombreSend
      });
    });
  });
}
function imagenProducto(id, res, nombreSend) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borraArchivo(nombreSend, "productos");
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productoDB) {
      borraArchivo(nombreSend, "productos");
      return res.status(400).json({
        ok: false,
        err: {
          message: "El producto no existe"
        }
      });
    }
    borraArchivo(productoDB.img, "productos");
    productoDB.img = nombreSend;
    productoDB.save((err,productoGuardado)=>{
        if (err) {
            return res.status(500).json({
              ok: false,
              err
            });
          }
          res.json({
            producto: productoGuardado,
            img: nombreSend
          });
    })
  });
}

function borraArchivo(nombreImagen, tipo) {
  let pathURL = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImagen}`
  );

  if (fs.existsSync(pathURL)) {
    fs.unlinkSync(pathURL);
  }
}
module.exports = app;
