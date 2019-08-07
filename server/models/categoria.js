const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema
let categoriaSchema = new Schema({
    descripcion:{
        type:String,
        unique:true,
        required:[true,'la descripcion es obligatoria']
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})
categoriaSchema.plugin(uniqueValidator,{message:'{PATH} debe ser unico'})
module.exports = mongoose.model('Categoria',categoriaSchema)
