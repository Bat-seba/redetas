// *********************************************************************************************************************
//  RUTA: backend/server.js 
// 
// 🔹 Este archivo representa el punto de entrada principal (entry point) de la aplicación de servidor.
// 🔹 Se encarga de inicializar los middlewares, conectar con la base de datos y orquestar todas las rutas.
// *********************************************************************************************************************

/**
 * @fileoverview Configuración y arranque del servidor Express.
 * Establece la conexión con MongoDB mediante Mongoose y define la arquitectura de la API REST.
 * @author Bat-seba Rodríguez Moreno
 */

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const cors = require('cors');
const path = require('path'); 

const app = express();

// -------------------------------------------------------------------------------- 
// MIDDLEWARES (Configuración)
// --------------------------------------------------------------------------------

// Habilita el intercambio de recursos de origen cruzado (CORS) para permitir peticiones desde el frontend
app.use(cors());

// Middleware para el procesamiento de cuerpos de petición en formato JSON
app.use(express.json());

// Middleware para servir recursos estáticos; permite el acceso público a las imágenes almacenadas en el servidor
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -------------------------------------------------------------------------------- 
// RUTAS (ENDPOINTS) - Conexión de módulos de enrutamiento
// --------------------------------------------------------------------------------

// Gestión de procesos de Autenticación (Login/Registro)
const authRoutes = require('./routes/auth');
app.use('/api/v1/auth', authRoutes);

// Gestión de perfiles de usuario, biografías y colecciones de favoritos
const usuarioRoutes = require('./routes/usuarios');
app.use('/api/v1/usuarios', usuarioRoutes);

// Gestión integral del ciclo de vida de las recetas (CRUD e interacciones)
const recetasRoutes = require('./routes/recetas');
app.use('/api/v1/recetas', recetasRoutes);

// -------------------------------------------------------------------------------- 
// CONEXIÓN A LA BASE DE DATOS (MAPPING DE PERSISTENCIA)
// --------------------------------------------------------------------------------

// Conecta el servidor con la instancia de MongoDB utilizando la URI definida en las variables de entorno
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conexión exitosa a la instancia de MongoDB'))
    .catch((error) => console.error('Fallo crítico en la conexión a la base de datos:', error));

// -------------------------------------------------------------------------------- 
// INICIALIZACIÓN DEL SERVIDOR
// --------------------------------------------------------------------------------

// Define el puerto de escucha utilizando la configuración del entorno o el valor 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor operativo y escuchando en el puerto ${PORT}`);
});