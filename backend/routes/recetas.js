// backend/routes/recetas.js sirve para crear nuevas recetas en la base de datos y guardarlas en la carpeta 'uploads' del servidor

const express = require('express');
const router = express.Router();
const multer = require('multer');
const recetaController = require('../controllers/recetaController');


// Configuración de Multer (El cartero que guarda las fotos en tu carpeta 'uploads')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') 
    },
    filename: function (req, file, cb) {
        // Le ponemos la fecha delante al nombre para que no se sobreescriban fotos iguales
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); 
    }
});

const upload = multer({ storage: storage });

// Esta es la ruta: Cuando React envíe datos a "/nueva", pasará por multer y luego al controlador
router.post('/nueva', upload.single('imagen'), recetaController.crearReceta);

// Ruta para leer todas las recetas (GET)
router.get('/', recetaController.obtenerRecetas);

// Ruta para leer una sola receta por su ID (GET)
router.get('/:id', recetaController.obtenerRecetaPorId);

// Rutas para interactuar con la receta
router.put('/:id/yummy', recetaController.toggleYummy);
router.post('/:id/comentarios', recetaController.agregarComentario);

// Rutas para interactuar con los comentarios
router.delete('/:id/comentarios/:comentarioId', recetaController.eliminarComentario);
router.post('/:id/comentarios/:comentarioId/respuestas', recetaController.responderComentario);
router.delete('/:id/comentarios/:comentarioId/respuestas/:respuestaId', recetaController.eliminarRespuesta);


module.exports = router;