// Usuario.js sirve para definir el "molde" o esquema para nuestros usuarios

const mongoose = require('mongoose');

// Definimos el "molde" o esquema para nuestros usuarios
const usuarioSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true // No puede haber dos usuarios con el mismo nombre
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // No puede haber dos correos iguales
  },
  password: { 
    type: String, 
    required: true // Aquí guardaremos la contraseña ya encriptada
  },
  foto_perfil_url: { 
    type: String, 
    default: '' // Por defecto estará vacía hasta que suban una foto
  },
  bio: { 
    type: String, 
    default: '' 
  },
  rol: { 
        type: String, 
        default: 'user' 
  },
  fecha_registro: { 
    type: Date, 
    default: Date.now // Se pone la fecha y hora actual automáticamente
  },
  recetasGuardadas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Receta'
  }],
  
});

// Exportamos el modelo para poder usarlo en nuestras rutas
module.exports = mongoose.model('Usuario', usuarioSchema);