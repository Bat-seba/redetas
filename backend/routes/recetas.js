// *********************************************************************************************************************
//  RUTA: backend/routes/recetas.js
// 
// 🔹 Este archivo gestiona las rutas relacionadas con el contenido principal: las recetas.
// *********************************************************************************************************************

/**
 * @fileoverview Enrutador para la entidad Receta.
 * Define los endpoints HTTP para el CRUD de publicaciones, manejo de archivos multimedia (Multer) y el sistema de interacciones sociales.
 * @author Bat-seba Rodríguez Moreno
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const recetaController = require('../controllers/recetaController');

// ==========================================
// CONFIGURACIÓN DE ALMACENAMIENTO (MULTER)
// ==========================================

// Configuración del middleware para interceptar y guardar archivos de imagen en el servidor
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define el directorio físico de destino para los archivos estáticos
    },
    filename: function (req, file, cb) {
        // Generación de un nombre de archivo único para evitar colisiones mediante el uso de marcas de tiempo y valores aleatorios
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); 
    }
});

const upload = multer({ storage: storage });

// ==========================================
// RUTAS DE CREACIÓN DE RECETAS (POST)
// ==========================================

// Endpoints para procesar la subida de una nueva receta interceptando la imagen adjunta
router.post('/nueva', upload.single('imagen'), recetaController.crearReceta);
router.post('/', upload.single('imagen'), recetaController.crearReceta);

// ==========================================
// RUTAS DE ACTUALIZACIÓN Y ELIMINACIÓN (PUT / DELETE)
// ==========================================

// Endpoint para modificar una publicación existente (procesando también un posible cambio de imagen)
router.put('/:id', upload.single('imagen'), recetaController.actualizarReceta);

// Endpoint para eliminar un registro de forma permanente
router.delete('/:id', recetaController.eliminarReceta);

// ==========================================
// RUTAS DE LECTURA Y CATÁLOGO (GET)
// ==========================================

// Obtención global del catálogo y obtención específica de una receta por su identificador
router.get('/', recetaController.obtenerRecetas);
router.get('/:id', recetaController.obtenerRecetaPorId);

// ==========================================
// RUTAS DE INTERACCIONES SOCIALES
// ==========================================

// Gestión de valoraciones (Yummys)
router.put('/:id/yummy', recetaController.toggleYummy);

// Gestión de hilos de comentarios (Creación y Eliminación)
router.post('/:id/comentarios', recetaController.agregarComentario);
router.delete('/:id/comentarios/:comentarioId', recetaController.eliminarComentario);

// Gestión de respuestas anidadas a comentarios existentes
router.post('/:id/comentarios/:comentarioId/respuestas', recetaController.responderComentario);
router.delete('/:id/comentarios/:comentarioId/respuestas/:respuestaId', recetaController.eliminarRespuesta);

// ==========================================
// RUTAS DE ADMINISTRACIÓN
// ==========================================

// Endpoint de uso exclusivo para las vistas de gestión del Administrador
router.get('/admin/todas', recetaController.obtenerTodasLasRecetas);

module.exports = router;