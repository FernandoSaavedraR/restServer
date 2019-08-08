const express = require("express");
const fs = require("fs");
const path = require("path");
let app = express();
const {verificaTokenIMG} = require('../middlewares/authentication')

app.get("/imagen/:tipo/:img",verificaTokenIMG, (req, res) => {
  let tipo = req.params.tipo;
  let img = req.params.img;
  let pathIMG = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
  let noImagePath = path.resolve(__dirname, "../assets/no-image.jpg");

  if (fs.existsSync(pathIMG)) {
    res.sendFile(pathIMG);
  } else {
    res.sendFile(noImagePath);
  }
  
});
module.exports = app;
