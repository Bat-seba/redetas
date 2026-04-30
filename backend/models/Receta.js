// *********************************************************************************************************************
//  RUTA: backend/models/Receta.js
// 
// 🔹 Este archivo sirve para definir el "molde" o esquema para nuestras recetas en la base de datos.
// *********************************************************************************************************************

/**
 * @fileoverview Modelo de datos para la entidad Receta.
 * Define la estructura, los tipos de datos y las validaciones requeridas por Mongoose.
 * @author Bat-seba Rodríguez Moreno
 */

const mongoose = require('mongoose');

// Definición del esquema principal para la colección de recetas
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
    
    // Estructuras de datos para el almacenamiento de interacciones sociales
    yummys: { 
        type: [String], 
        default: [] 
    },
    comentarios: { 
        type: Array, 
        default: [] 
    },
    
    // Array de clasificación dietética con validación personalizada obligatoria
    categorias: {
        type: [String], 
        validate: [v => Array.isArray(v) && v.length > 0, 'Debes seleccionar al menos una categoría']
    },
    
    // Referencia de la ruta física del archivo multimedia en el servidor
    imagen: {
        type: String, 
        default: null 
    },
    
    // Relación referencial con el autor de la publicación (Clave foránea de la entidad Usuario)
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', 
        required: true
    },
    nombreAutor: {
        type: String, 
        required: true 
    },
    
    // Marca temporal automática para el ordenamiento cronológico de las publicaciones
    fechaPublicacion: {
        type: Date,
        default: Date.now 
    }
});

// Compilación y exportación del modelo para su implementación en los controladores
module.exports = mongoose.model('Receta', recetaSchema);