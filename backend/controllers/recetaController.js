// *********************************************************************************************************************
//  RUTA: backend/controllers/recetaController.js 
// 
//  🔹 Este archivo sirve para crear nuevas recetas en la base de datos.
//
//  🔹 Contiene las funciones para crear, actualizar, obtener y eliminar recetas.
// *********************************************************************************************************************

/**
 * @fileoverview Controlador encargado de la gestión de la entidad Receta.
 * Maneja las operaciones CRUD y las interacciones sociales (comentarios y reacciones).
 * @author Bat-seba Rodríguez Moreno
 */

const Receta = require('../models/Receta');

// =========================================================================
// 1. FUNCIÓN PARA CREAR UNA RECETA NUEVA
// =========================================================================
/**
 * Crea y almacena una nueva receta en la base de datos procesando datos multipartes (texto e imagen).
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.crearReceta = async (req, res) => {
    try {
        const { titulo, ingredientes, instrucciones, categorias, autor, nombreAutor } = req.body;

        // Gestión del archivo de imagen si se adjunta en la petición
        let nombreImagen = null;
        if (req.file) {
            nombreImagen = req.file.filename; 
        }

        // Parseo de la cadena JSON a Array para el campo de categorías
        let categoriasArray = [];
        if (categorias) {
            categoriasArray = JSON.parse(categorias); 
        }

        // Instanciación del modelo con los datos procesados
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
            mensaje: 'Receta publicada con éxito', 
            receta: nuevaReceta 
        });

    } catch (error) {
        console.error("Error al guardar la receta:", error);
        res.status(500).json({ mensaje: 'Hubo un error en el servidor al guardar la receta.' });
    }
};

// =========================================================================
// 2. FUNCIÓN PARA OBTENER TODAS LAS RECETAS EN EL INICIO
// =========================================================================
/**
 * Obtiene el catálogo de recetas ordenadas por fecha de publicación descendente.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.obtenerRecetas = async (req, res) => {
    try {
        // Consulta global con expansión (populate) de la foto de perfil del autor
        const recetas = await Receta.find()
            .populate('autor', 'foto_perfil_url')
            .sort({ fechaPublicacion: -1 });
            
        res.status(200).json(recetas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las recetas" });
    }
};

// =========================================================================
// 3. FUNCIÓN PARA OBTENER UNA SOLA RECETA POR SU ID (DETALLE DE RECETA)
// =========================================================================
/**
 * Recupera los detalles específicos de una receta a partir de su identificador único.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.obtenerRecetaPorId = async (req, res) => {
    try {
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
/**
 * Gestiona la interacción de validación positiva ("Yummy"). 
 * Implementa una lógica de alternancia (toggle) sobre el array de interacciones.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.toggleYummy = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        const { userId } = req.body;
        
        if (!receta.yummys) receta.yummys = [];
        
        const index = receta.yummys.indexOf(userId);
        
        // Si el usuario no ha interactuado, se añade; de lo contrario, se elimina.
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

/**
 * Añade un nuevo comentario de nivel superior al array de comentarios de la receta.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
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

/**
 * Elimina un comentario específico del array mediante filtrado funcional.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.eliminarComentario = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        
        receta.comentarios = receta.comentarios.filter(c => c.id !== req.params.comentarioId);
        
        // Notifica a Mongoose explícitamente el cambio en el subdocumento
        receta.markModified('comentarios');
        
        await receta.save();
        res.status(200).json(receta.comentarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar comentario" });
    }
};

/**
 * Añade una respuesta anidada a un comentario de nivel superior existente.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.responderComentario = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        const comentarioIndex = receta.comentarios.findIndex(c => c.id === req.params.comentarioId);
        
        if (comentarioIndex !== -1) {
            const nuevaRespuesta = { 
                id: Date.now().toString(), 
                usuarioId: req.body.usuarioId, 
                nombreUsuario: req.body.nombreUsuario, 
                texto: req.body.texto, 
                fecha: new Date() 
            };
            
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

/**
 * Elimina una respuesta anidada de un comentario específico.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
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

/**
 * Sobrescribe los datos de una receta existente, incluyendo lógica condicional para el manejo de la imagen y categorías.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.actualizarReceta = async (req, res) => {
    try {
        const { titulo, ingredientes, instrucciones, categorias } = req.body;
        const recetaId = req.params.id;

        // Normalización y parseo seguro del array de categorías
        let categoriasArray = [];
        if (categorias) {
            if (Array.isArray(categorias)) {
                categoriasArray = categorias;
            } else {
                try { 
                    categoriasArray = JSON.parse(categorias); 
                } catch (e) { 
                    categoriasArray = [categorias]; 
                }
            }
        }

        const datosActualizados = { titulo, ingredientes, instrucciones, categorias: categoriasArray };

        // Anexa el nuevo archivo multimedia si se incluye en la solicitud PUT
        if (req.file) {
            datosActualizados.imagen = req.file.filename;
        }

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

/**
 * Elimina permanentemente un documento de receta de la base de datos.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.eliminarReceta = async (req, res) => {
    try {
        const recetaEliminada = await Receta.findByIdAndDelete(req.params.id);
        if (!recetaEliminada) return res.status(404).json({ mensaje: 'Receta no encontrada' });
        res.status(200).json({ mensaje: 'Receta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Hubo un error al borrar la receta.' });
    }
};

// =========================================================================
// 7. FUNCIÓN PARA OBTENER TODAS LAS RECETAS (SOLO PARA ADMINISTRADOR)
// =========================================================================

/**
 * Obtiene el catálogo completo de todas las recetas registradas en la base de datos.
 * Ruta de acceso restringido, destinada exclusivamente a las vistas de administración.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.obtenerTodasLasRecetas = async (req, res) => {
    try {
        // Realiza la consulta global y expande la referencia del autor para obtener su nombre de usuario
        const recetas = await Receta.find().populate('autor', 'username');
        
        res.status(200).json(recetas);
    } catch (error) {
        console.error("Error en el controlador al obtener la lista global de recetas:", error);
        res.status(500).json({ mensaje: 'Error interno al procesar la solicitud de recetas' });
    }
};