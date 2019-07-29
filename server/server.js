require('./config/config')
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//pedir datos
app.get("/usuario", function(req, res) {
  res.json("get Usuario");
});
//mandar datos
app.post("/usuario", function(req, res) {
  let body = req.body;
  if (body.nombre === undefined) {
      res.status(400).json({
          ok:false,
          mensaje:'El nombre es necesario'
      })
  } else {
    res.json({ body, metodo: "post Usuario" });
  }
});
//actualizar datos
app.put("/usuario/:id", function(req, res) {
  let id = req.params.id;
  res.json({ id, metodo: "put usuario" });
});
//"borrar" (cambiar estado) de los datos
app.delete("/usuario", function(req, res) {
  res.json("delete Usuario");
});

app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto ${process.env.PORT}`);
});
