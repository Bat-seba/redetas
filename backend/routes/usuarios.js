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

//  multer espera el campo 'foto_perfil_url'
router.put('/:id', upload.single('foto_perfil_url'), usuarioController.actualizarPerfil);

router.get('/:id', usuarioController.obtenerUsuario);

module.exports = router;