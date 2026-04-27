// backend/routes/recetas.js - Rutas de Recetas
const express = require('express');
const router = express.Router();
const multer = require('multer');
const recetaController = require('../controllers/recetaController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); 
    }
});

const upload = multer({ storage: storage });


router.post('/nueva', upload.single('imagen'), recetaController.crearReceta);


router.post('/', upload.single('imagen'), recetaController.crearReceta);

// --- RESTO DEL ARCHIVO EXACTAMENTE COMO ESTA MAÑANA ---
router.put('/:id', upload.single('imagen'), recetaController.actualizarReceta);
router.delete('/:id', recetaController.eliminarReceta);

router.get('/', recetaController.obtenerRecetas);
router.get('/:id', recetaController.obtenerRecetaPorId);

router.put('/:id/yummy', recetaController.toggleYummy);
router.post('/:id/comentarios', recetaController.agregarComentario);

router.delete('/:id/comentarios/:comentarioId', recetaController.eliminarComentario);
router.post('/:id/comentarios/:comentarioId/respuestas', recetaController.responderComentario);
router.delete('/:id/comentarios/:comentarioId/respuestas/:respuestaId', recetaController.eliminarRespuesta);

module.exports = router;