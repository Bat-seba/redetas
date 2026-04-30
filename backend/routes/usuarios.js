// *********************************************************************************************************************
//  RUTA: backend/routes/usuarios.js 
// 
// 🔹 Este archivo gestiona las rutas correspondientes a las operaciones sobre los perfiles de usuario.
// *********************************************************************************************************************

/**
 * @fileoverview Enrutador para la entidad Usuario.
 * Define los endpoints HTTP para la gestión de perfiles, actualización de credenciales, colecciones de favoritos y herramientas de administración.
 * @author Bat-seba Rodríguez Moreno
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const usuarioController = require('../controllers/usuarioController');

// ==========================================
// CONFIGURACIÓN DE ALMACENAMIENTO (MULTER)
// ==========================================

// Configuración del middleware para interceptar y guardar las fotos de perfil en el servidor
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define el directorio físico de destino para los archivos multimedia
    },
    filename: function (req, file, cb) {
        // Generación de un identificador único concatenado al prefijo 'perfil-' para evitar la colisión de nombres
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'perfil-' + uniqueSuffix + '-' + file.originalname); 
    }
});

const upload = multer({ storage: storage });

// ==========================================
// RUTAS DE GESTIÓN DE PERFIL
// ==========================================

// Endpoint para sobrescribir los datos del perfil de un usuario (incluyendo la foto de perfil)
router.put('/:id', upload.single('foto_perfil_url'), usuarioController.actualizarPerfil);

// Endpoint para consultar el detalle público y la colección de recetas de un usuario mediante su ID
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// ==========================================
// RUTAS DE INTERACCIONES Y COLECCIONES
// ==========================================

// Endpoint para la gestión de favoritos (añadir o retirar una receta de la colección del usuario)
router.put('/:id/guardar', usuarioController.toggleGuardarReceta);

// ==========================================
// RUTAS DE SEGURIDAD Y CUENTA
// ==========================================

// Endpoint independiente y específico para el proceso de modificación de la contraseña
router.put('/:id/password', usuarioController.actualizarPassword);

// Endpoint para borrar permanentemente el registro del usuario del sistema
router.delete('/:id', usuarioController.eliminarUsuario);

// ==========================================
// RUTAS DE ADMINISTRACIÓN
// ==========================================

// Endpoint de uso exclusivo para las vistas de gestión del Administrador
router.get('/admin/usuarios', usuarioController.obtenerTodosLosUsuarios);

module.exports = router;