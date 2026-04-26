// Receta.js sirve para definir el "molde" o esquema para nuestras recetas


const mongoose = require('mongoose');

// Definimos el "molde" o esquema para nuestras recetas
const recetaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true 
  },
  ingredientes: {
    type: String,
    required: [true, 'Los ingredientes son obligatorios']
  },
  instrucciones: {
    type: String,
    required: [true, 'Las instrucciones son obligatorias']
  },
  
  yummys: { 
    type: [String], default: [] },
    comentarios: { type: Array, default: [] 
  },
  
  //  lista (Array) de textos
  categorias: {
    type: [String], 
    validate: [v => Array.isArray(v) && v.length > 0, 'Debes seleccionar al menos una categoría']
  },
  imagen: {
    type: String, 
    default: null 
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', 
    required: true
  },
  nombreAutor: {
    type: String, 
    required: true 
  },
  fechaPublicacion: {
    type: Date,
    default: Date.now 
  }
});

// Exportamos el modelo
module.exports = mongoose.model('Receta', recetaSchema);