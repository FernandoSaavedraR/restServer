
const express = require("express");
const app = express();
let { verificaToken,verificaRole } = require("../middlewares/authentication");
const _ = require ('underscore')
let Categoria = require("../models/categoria");

//todas las categorias
app.get("/categoria", [verificaToken], (req, res) => {
  let condicionesDeBusqueda = {};
  Categoria.find(condicionesDeBusqueda)
  .sort('descripcion')
  .populate('usuario','nombre email')
  
  .exec((err, categorias) => {
    if (err)
      return res.status(400).json({
        ok: false,
        err
      });
    Categoria.countDocuments(condicionesDeBusqueda, (err, conteo) => {
      if (err)
        return res.status(400).json({
          ok: false,
          err
        });
      res.json({
        ok: true,
        conteo,
        categorias
      });
    });
  });
});

//mostrar una categoria por id
app.get("/categoria/:id", [verificaToken], (req, res) => {
  let id = req.params.id;
  Categoria.findById(id, (err, Categoria) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err,
        
      });
    if(!Categoria){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Categoria no encontrada'
            }
        })
    }
    res.json({ ok: true, Categoria }); 
  });
});

//crear nueva categoria
app.post("/categoria", [verificaToken,verificaRole], (req, res) => {
  let body = req.body;
  let usuario = req.usuario;
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario
  });
  categoria.save((err, categoria) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });
    if(!categoria){
      return res.status(400).json({
        ok:false,
        err:{
          message:'No se logró crear la categoria'
        }
      })
    }
    res.status(200).json({ ok: true, categoria });
  });
  // let categoria = new Categoria({

  // })
});

//actualizar una categoria
app.put("/categoria/:id",[verificaToken,verificaRole],(req,res)=>{
    let id = req.params.id
    let body = _.pickD
    Categoria.findByIdAndUpdate(id,body,{new:true},(err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
          return res.status(400).json({
            ok:false,
            err:{
              message:'No se logró crear la categoria'
            }
          })
        }
        res.json({ok:true,categoriaDB})
    })
});

//borrar una categoria (solo un admin)
app.delete("/categoria/:id", [verificaToken,verificaRole], (req, res) => {
  let id = req.params.id;
  Categoria.findByIdAndRemove(id, (err, CategoriaBorrada) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!CategoriaBorrada) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Categoria no encontrada"
        }
      });
    }
    res.json({
      ok: true,
      categoria: CategoriaBorrada
    });
  });
});
module.exports = app;
