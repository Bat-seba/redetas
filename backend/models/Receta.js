// ===============================================================================================================================
// ARCHIVO: models/Receta.js es el archivo donde definimos el "Esquema" (Schema) de nuestras recetas utilizando Mongoose.
// 
// 🔹 Su función es establecer la estructura fija que deben tener los documentos en la colección de MongoDB. Lo que quiere decir
//     que cualquier receta que intentemos guardar debe cumplir con estos campos y tipos de datos.
// 
// 🔹 Este archivo permite validar los datos antes de que lleguen a la base de datos, asegurando que ninguna receta se guarde sin
//     título o sin las categorías de alérgenos.
// ===============================================================================================================================


const mongoose = require('mongoose');

// -------------------------------------------------------------------------------- 
// DEFINICIÓN DE LA ESTRUCTURA DE UNA RECETA:
// --------------------------------------------------------------------------------

const recetaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },            // Campo requirido (required: true) para el nombre de la receta
    descripcion: { type: String, required: true },       // Campo requirido (required: true) para la descripción de la receta
    categorias: { type: String, required: true },        // Campo requirido (required: true) para las categorías de alérgenos
    foto_principal_url: { type: String, default: "" }    // Campo opcional (default: "") para la URL de la foto principal de la receta
}, { 
    timestamps: true     // Añade automáticamente las fechas de creación y actualización de la receta (createdAt y updatedAt)
});


// -------------------------------------------------------------------------------- 
// EXPORTACIÓN DEL MODELO DE RECETA:
// --------------------------------------------------------------------------------
// Se exporta el modelo llamado 'Receta' para poder usarlo en el servidor
module.exports = mongoose.model('Receta', recetaSchema);