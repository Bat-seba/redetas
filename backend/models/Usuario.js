// *********************************************************************************************************************
//  RUTA: backend/models/Usuario.js
// 
// 🔹 Este archivo sirve para definir el "molde" o esquema para nuestros usuarios en la base de datos.
// *********************************************************************************************************************

/**
 * @fileoverview Modelo de datos para la entidad Usuario.
 * Define la estructura, restricciones de unicidad y las relaciones con la colección de Recetas.
 * @author Bat-seba Rodríguez Moreno
 */

const mongoose = require('mongoose');

// Definición del esquema principal para la colección de usuarios
const usuarioSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true // Restricción de unicidad para evitar nombres de usuario duplicados
    },
    email: { 
        type: String, 
        required: true, 
        unique: true // Restricción de unicidad para correos electrónicos
    },
    password: { 
        type: String, 
        required: true // Almacena de forma persistente el hash criptográfico de la contraseña
    },
    foto_perfil_url: { 
        type: String, 
        default: '' // Ruta o referencia del archivo multimedia; inicializado en blanco por defecto
    },
    bio: { 
        type: String, 
        default: '' 
    },
    rol: { 
        type: String, 
        default: 'user' // Define los privilegios de acceso (user/admin)
    },
    fecha_registro: { 
        type: Date, 
        default: Date.now // Marca temporal asignada automáticamente en el momento de la instanciación
    },
    
    // Array de referencias para almacenar la colección de favoritos del usuario
    recetasGuardadas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Receta'
    }]
});

// Compilación y exportación del modelo para su implementación en el resto del sistema
module.exports = mongoose.model('Usuario', usuarioSchema);