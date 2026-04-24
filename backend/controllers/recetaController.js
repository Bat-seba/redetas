const Receta = require('../models/Receta');

// Función para crear una receta nueva
exports.crearReceta = async (req, res) => {
    try {
        const { titulo, ingredientes, instrucciones, categorias, autor, nombreAutor } = req.body;

        let nombreImagen = null;
        if (req.file) {
            nombreImagen = req.file.filename; 
        }

        // Se traduce  el texto que llega de React y se convierte  en un Array real
        let categoriasArray = [];
        if (categorias) {
            categoriasArray = JSON.parse(categorias); 
        }

        const nuevaReceta = new Receta({
            titulo,
            ingredientes,
            instrucciones,
            categorias: categoriasArray, // Metemos el Array limpio en el molde
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
// Función para obtener todas las recetas y mostrarlas en el Inicio
exports.obtenerRecetas = async (req, res) => {
    try {
        // Buscamos todas las recetas y las ordenamos de la más nueva a la más antigua
        const recetas = await Receta.find().sort({ fechaPublicacion: -1 });
        res.status(200).json(recetas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las recetas" });
    }
};

// Función para obtener UNA SOLA receta por su ID
exports.obtenerRecetaPorId = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        if (!receta) return res.status(404).json({ mensaje: 'Receta no encontrada' });
        res.status(200).json(receta);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la receta" });
    }
};

// Función para Dar/Quitar Yummy
exports.toggleYummy = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        const { userId } = req.body;
        
        // Si no existe el array, lo creamos por seguridad
        if (!receta.yummys) receta.yummys = [];

        const index = receta.yummys.indexOf(userId);
        if (index === -1) {
            receta.yummys.push(userId); // Si no le había dado Yummy, se lo damos
        } else {
            receta.yummys.splice(index, 1); // Si ya le había dado, se lo quitamos
        }

        await receta.save();
        res.status(200).json(receta.yummys);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar Yummys" });
    }
};

// Función para publicar Comentario (ACTUALIZADA con ID y Respuestas)
exports.agregarComentario = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        if (!receta.comentarios) receta.comentarios = [];

        const nuevoComentario = {
            id: Date.now().toString(), // Le damos un DNI único al comentario
            usuarioId: req.body.usuarioId,
            nombreUsuario: req.body.nombreUsuario,
            texto: req.body.texto,
            fecha: new Date(),
            respuestas: [] // Se Prepara la caja para futuras respuestas
        };

        receta.comentarios.push(nuevoComentario);
        await receta.save();
        res.status(201).json(receta.comentarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar el comentario" });
    }
};

// Función para Eliminar tu propio comentario
exports.eliminarComentario = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        const { comentarioId } = req.params;

        // Filtramos para quedarnos con todos MENOS el que queremos borrar
        receta.comentarios = receta.comentarios.filter(c => c.id !== comentarioId);
        
        // Le decimos a la base de datos que este array ha sido modificado y guardamos
        receta.markModified('comentarios');
        await receta.save();
        res.status(200).json(receta.comentarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar comentario" });
    }
};

// Función para Responder a un comentario
exports.responderComentario = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        const { comentarioId } = req.params;

        // Buscamos el comentario original al que estamos respondiendo
        const comentarioIndex = receta.comentarios.findIndex(c => c.id === comentarioId);
        
        if (comentarioIndex !== -1) {
            const nuevaRespuesta = {
                id: Date.now().toString(),
                usuarioId: req.body.usuarioId,
                nombreUsuario: req.body.nombreUsuario,
                texto: req.body.texto,
                fecha: new Date()
            };
            
            // Si el comentario es antiguo y no tenía array de respuestas, se lo creamos
            if (!receta.comentarios[comentarioIndex].respuestas) {
                receta.comentarios[comentarioIndex].respuestas = [];
            }
            
            receta.comentarios[comentarioIndex].respuestas.push(nuevaRespuesta);
            receta.markModified('comentarios');
            await receta.save();
        }

        res.status(201).json(receta.comentarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al responder comentario" });
    }
};

// Función para Eliminar una RESPUESTA específica
exports.eliminarRespuesta = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        const { comentarioId, respuestaId } = req.params;

        // 1. Buscamos el comentario principal
        const comentarioIndex = receta.comentarios.findIndex(c => c.id === comentarioId);
        
        if (comentarioIndex !== -1 && receta.comentarios[comentarioIndex].respuestas) {
            // 2. Filtramos para borrar solo la respuesta que queremos
            receta.comentarios[comentarioIndex].respuestas = receta.comentarios[comentarioIndex].respuestas.filter(r => r.id !== respuestaId);
            
            // 3. Guardamos los cambios
            receta.markModified('comentarios');
            await receta.save();
        }

        res.status(200).json(receta.comentarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar respuesta" });
    }
};