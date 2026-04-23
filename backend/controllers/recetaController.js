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


};