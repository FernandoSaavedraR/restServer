require('./config/config')

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose')

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./routes/index'))


mongoose.connect(process.env.URLDB,{ useNewUrlParser: true, useFindAndModify: false },
(err,res)=>{
  if(err) throw err
  console.log('Base de datos online');
})
mongoose.set('useCreateIndex', true);

app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto ${process.env.PORT}`);
});
