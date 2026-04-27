// backend/controllers/recetaController.js sirve para crear nuevas recetas en la base de datos.

const Receta = require('../models/Receta');

// =========================================================================
// 1. FUNCIÓN PARA CREAR UNA RECETA NUEVA
// =========================================================================
exports.crearReceta = async (req, res) => {
    try {
        const { titulo, ingredientes, instrucciones, categorias, autor, nombreAutor } = req.body;

        let nombreImagen = null;
        if (req.file) {
            nombreImagen = req.file.filename; 
        }

        let categoriasArray = [];
        if (categorias) {
            categoriasArray = JSON.parse(categorias); 
        }

        const nuevaReceta = new Receta({
            titulo,
            ingredientes,
            instrucciones, 
            categorias: categoriasArray,
            autor,
            nombreAutor,
            imagen: nombreImagen
        });

        await nuevaReceta.save();

        res.status(201).json({ 
            mensaje: '¡Receta publicada con éxito!', 
            receta: nuevaReceta 
        });

    } catch (error) {
        console.error("Error al guardar la receta:", error);
        res.status(500).json({ mensaje: 'Hubo un error en el servidor al guardar la receta.' });
    }
};

// =========================================================================
// 2. FUNCIÓN PARA OBTENER TODAS LAS RECETAS (INICIO)
// =========================================================================
exports.obtenerRecetas = async (req, res) => {
    try {
        // .populate busca en la tabla de Usuarios la foto del autor
        const recetas = await Receta.find()
            .populate('autor', 'foto_perfil_url') 
            .sort({ fechaPublicacion: -1 });
            
        res.status(200).json(recetas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las recetas" });
    }
};

// =========================================================================
// 3. FUNCIÓN PARA OBTENER UNA SOLA RECETA POR SU ID (DETALLE)
// =========================================================================
exports.obtenerRecetaPorId = async (req, res) => {
    try {
        // .populate busca en la tabla de Usuarios la foto del autor y traemos la foto para la página de detalle
        const receta = await Receta.findById(req.params.id)
            .populate('autor', 'foto_perfil_url');

        if (!receta) return res.status(404).json({ mensaje: 'Receta no encontrada' });
        res.status(200).json(receta);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la receta" });
    }
};

// =========================================================================
// 4. FUNCIÓN PARA DAR/QUITAR YUMMY
// =========================================================================
exports.toggleYummy = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        const { userId } = req.body;
        if (!receta.yummys) receta.yummys = [];
        const index = receta.yummys.indexOf(userId);
        if (index === -1) {
            receta.yummys.push(userId);
        } else {
            receta.yummys.splice(index, 1);
        }
        await receta.save();
        res.status(200).json(receta.yummys);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar Yummys" });
    }
};

// =========================================================================
// 5. GESTIÓN DE COMENTARIOS
// =========================================================================
exports.agregarComentario = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        if (!receta.comentarios) receta.comentarios = [];
        const nuevoComentario = {
            id: Date.now().toString(),
            usuarioId: req.body.usuarioId,
            nombreUsuario: req.body.nombreUsuario,
            texto: req.body.texto,
            fecha: new Date(),
            respuestas: []
        };
        receta.comentarios.push(nuevoComentario);
        await receta.save();
        res.status(201).json(receta.comentarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar el comentario" });
    }
};

exports.eliminarComentario = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        receta.comentarios = receta.comentarios.filter(c => c.id !== req.params.comentarioId);
        receta.markModified('comentarios');
        await receta.save();
        res.status(200).json(receta.comentarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar comentario" });
    }
};

exports.responderComentario = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        const comentarioIndex = receta.comentarios.findIndex(c => c.id === req.params.comentarioId);
        if (comentarioIndex !== -1) {
            const nuevaRespuesta = { id: Date.now().toString(), usuarioId: req.body.usuarioId, nombreUsuario: req.body.nombreUsuario, texto: req.body.texto, fecha: new Date() };
            if (!receta.comentarios[comentarioIndex].respuestas) receta.comentarios[comentarioIndex].respuestas = [];
            receta.comentarios[comentarioIndex].respuestas.push(nuevaRespuesta);
            receta.markModified('comentarios');
            await receta.save();
        }
        res.status(201).json(receta.comentarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al responder comentario" });
    }
};

exports.eliminarRespuesta = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        const comentarioIndex = receta.comentarios.findIndex(c => c.id === req.params.comentarioId);
        if (comentarioIndex !== -1) {
            receta.comentarios[comentarioIndex].respuestas = receta.comentarios[comentarioIndex].respuestas.filter(r => r.id !== req.params.respuestaId);
            receta.markModified('comentarios');
            await receta.save();
        }
        res.status(200).json(receta.comentarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar respuesta" });
    }
};

// =========================================================================
// 6. FUNCIONES DEL CRUD (EDITAR Y BORRAR RECETAS)
// =========================================================================

exports.actualizarReceta = async (req, res) => {
    try {
        const { titulo, ingredientes, instrucciones, categorias } = req.body;
        const recetaId = req.params.id;

        let categoriasArray = [];
        if (categorias) {
            if (Array.isArray(categorias)) {
                categoriasArray = categorias;
            } else {
                try { categoriasArray = JSON.parse(categorias); } catch (e) { categoriasArray = [categorias]; }
            }
        }

        const datosActualizados = { titulo, ingredientes, instrucciones, categorias: categoriasArray };

        if (req.file) {
            datosActualizados.imagen = req.file.filename;
        }

        // Se agrega el autor al actualizar para que el frontend reciba la foto del autor de la receta actualizada.
        const recetaActualizada = await Receta.findByIdAndUpdate(
            recetaId,
            datosActualizados,
            { new: true } 
        ).populate('autor', 'foto_perfil_url');

        if (!recetaActualizada) {
            return res.status(404).json({ mensaje: 'Receta no encontrada' });
        }

        res.status(200).json({ mensaje: 'Receta actualizada con éxito', receta: recetaActualizada });

    } catch (error) {
        console.error("Error al actualizar la receta:", error);
        res.status(500).json({ mensaje: 'Hubo un error en el servidor.' });
    }
};

exports.eliminarReceta = async (req, res) => {
    try {
        const recetaEliminada = await Receta.findByIdAndDelete(req.params.id);
        if (!recetaEliminada) return res.status(404).json({ mensaje: 'Receta no encontrada' });
        res.status(200).json({ mensaje: 'Receta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Hubo un error al borrar la receta.' });
    }
};