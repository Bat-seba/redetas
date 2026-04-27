// backend/routes/usuarios.js sirve para actualizar el perfil del usuario en la base de datos

const express = require('express');
const router = express.Router();
const multer = require('multer');
const usuarioController = require('../controllers/usuarioController');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'perfil-' + uniqueSuffix + '-' + file.originalname); 
    }
});

const upload = multer({ storage: storage });

// 1. Actualizar perfil
router.put('/:id', upload.single('foto_perfil_url'), usuarioController.actualizarPerfil);

// 2. Obtener perfil
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// 3. Guardar/Quitar Favoritos
router.put('/:id/guardar', usuarioController.toggleGuardarReceta);

// 4. Cambiar contraseña
router.put('/:id/password', usuarioController.actualizarPassword);

// 5. Eliminar cuenta
router.delete('/:id', usuarioController.eliminarUsuario);

// 6. Obtener todos los usuarios
router.get('/admin/usuarios', usuarioController.obtenerTodosLosUsuarios);

module.exports = router;