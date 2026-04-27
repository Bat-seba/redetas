// ========================================================================================================================================
// ARCHIVO: server.js - Versión Limpia y Sincronizada
// ========================================================================================================================================

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const path = require('path'); // Añadido para gestionar rutas de archivos

const app = express();

// -------------------------------------------------------------------------------- 
// MIDDLEWARES (Configuración)
// --------------------------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Servir fotos

// -------------------------------------------------------------------------------- 
// RUTAS (ENDPOINTS) - Conectamos los archivos de la carpeta /routes
// --------------------------------------------------------------------------------

// Rutas de Autenticación (Login/Registro)
const authRoutes = require('./routes/auth');
app.use('/api/v1/auth', authRoutes);

// Rutas de Usuarios (Perfil y FAVORITOS) 
const usuarioRoutes = require('./routes/usuarios');
app.use('/api/v1/usuarios', usuarioRoutes);

// Rutas de Recetas (CRUD completo)
const recetasRoutes = require('./routes/recetas');
app.use('/api/v1/recetas', recetasRoutes);

// -------------------------------------------------------------------------------- 
// CONEXIÓN A LA BASE DE DATOS
// --------------------------------------------------------------------------------
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('¡Conexión exitosa a MongoDB Local!'))
    .catch((error) => console.error('Error conectando a la base de datos:', error));

// -------------------------------------------------------------------------------- 
// INICIALIZACIÓN DEL SERVIDOR
// --------------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});