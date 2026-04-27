// ========================================================================================================================================
// ARCHIVO: server.js es el archivo principal de nuestro servidor. Sirve para levantar una API REST local utilizando Node.js y Express.
//          
// 🔹 Su función principal es actuar como un intermediario encargado de conectar la aplicación con la base de datos (MongoDB) y 
//     quedarse en espera en el puerto 3000 de recibir todas las peticiones que llegan desde el Frontend (React).
//          
// 🔹 En este archivo se escriben todas las configuraciones de seguridad (CORS), la conexión a la base de datos y las rutas (Endpoints) 
//     que definen qué debe hacer el sistema cuando el usuario quiere Crear (POST), Leer (GET), Editar (PUT) o Borrar (DELETE) una receta.
// ========================================================================================================================================


// -------------------------------------------------------------------------------- 
// IMPORTACIÓN DE LIBRERÍAS Y HERRAMIENTAS:
// --------------------------------------------------------------------------------
const express = require('express');     // Importa Express que me permite crear el servidor web.
const mongoose = require('mongoose');   // Importa Mongoose que me permite conectarme a la base de datos.
require('dotenv').config();             // Importa dotenv que me permite acceder a las variables de entorno.
const cors = require('cors');           // Importa CORS que me permite permitir el acceso a la API desde cualquier origen.

const Receta = require('./models/Receta');    // Importa el modelo de receta para interactuar con la base de datos.
const app = express();     // Crea una instancia de Express llamada "app" para iniciar el servidor.

const authRoutes = require('./routes/auth');   // Importa las rutas de autenticación.

// -------------------------------------------------------------------------------- 
// CONFIGURACIÓN DEL SERVIDOR:
// --------------------------------------------------------------------------------
app.use(cors());          // Habilita CORS para permitir el acceso a la API desde cualquier origen y así evitar errores de seguridad.
app.use(express.json());  // Habilita el uso de JSON en las solicitudes y respuestas, un formato comprensible por el servidor Node.js.
app.use('/api/v1/auth', authRoutes);   // Utiliza las rutas de autenticación.
app.use('/api/v1/usuarios', require('./routes/usuarios'));   // Utiliza las rutas de usuarios.

// 1. Damos permiso para que las fotos de la carpeta 'uploads' se puedan ver en la web
app.use('/uploads', express.static('uploads'));

// 2. Importamos y encendemos la nueva ruta de recetas
const recetasRoutes = require('./routes/recetas');
app.use('/api/v1/recetas', recetasRoutes);


// -------------------------------------------------------------------------------- 
// CONEXIÓN A LA BASE DE DATOS:
// --------------------------------------------------------------------------------
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('¡Conexión exitosa a MongoDB Local!'))
    .catch((error) => console.error('Error conectando a la base de datos:', error));


// -------------------------------------------------------------------------------- 
// RUTAS DE LA API REST (ENDPOINTS DE LA CRUD):
// --------------------------------------------------------------------------------

// Endpoint GET para obtener o leer todo el catálogo de recetas - READ 
app.get('/api/v1/recetas', async (req, res) => {
    try {
        const recetas = await Receta.find();    // Pide a Mongoose que me devuelva todas las recetas
        res.status(200).json(recetas);          // Devuelve todas las recetas (código 200 de éxito)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las recetas', error });
    }
});

// Endpoint POST para crear una nueva receta - CREATE
app.post('/api/v1/recetas', async (req, res) => {
    try {
        const nuevaReceta = new Receta(req.body);    // req.body contiene los datos de la nueva receta del formulario (titulo, descripcion, categorias, foto_principal_url)
        await nuevaReceta.save();    // Guarda la nueva receta en la base de datos
        res.status(201).json({ mensaje: '¡Receta publicada con éxito!', receta: nuevaReceta });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al publicar la receta.', error });
    }
});

// Endpoint DELETE para borrar permanentemente una receta por su ID -   DELETE 
app.delete('/api/v1/recetas/:id', async (req, res) => {
    try {
        await Receta.findByIdAndDelete(req.params.id);    // req.params.id extrae el ID de la receta que se quiere borrar
        res.status(200).json({ mensaje: 'Receta eliminada correctamente 🗑️' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la receta', error });
    }
});

// Endpoint PUT para actualizar o editar una receta por su ID - UPDATE
app.put('/api/v1/recetas/:id', async (req, res) => {
    try {
        const recetaActualizada = await Receta.findByIdAndUpdate(req.params.id, req.body, { new: true });  // req.body busca por ID y sobreescribe con los nuevos datos y { new: true } devuelve la receta actualizada
        res.status(200).json({ mensaje: 'Receta actualizada', receta: recetaActualizada });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la receta', error });
    }
});


// -------------------------------------------------------------------------------- 
// INICIALIZACIÓN DEL SERVIDOR:
// --------------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});