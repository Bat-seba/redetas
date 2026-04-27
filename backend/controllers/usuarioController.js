// backend/controllers/usuarioController.js sirve para actualizar el perfil del usuario en la base de datos.

const Usuario = require('../models/Usuario');

exports.actualizarPerfil = async (req, res) => {
    try {
        const userId = req.params.id;
        const { bio, borrar_foto } = req.body; // Se captura  la señal de borrar
        
        let updateData = {};
        
        if (bio !== undefined) {
            updateData.bio = bio;
        }

        // Si hay archivo nuevo, lo guardamos. Si viene la señal de borrar, lo vaciamos.
        if (req.file) {
            updateData.foto_perfil_url = req.file.filename;
        } else if (borrar_foto === 'true') {
            updateData.foto_perfil_url = ''; 
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!usuarioActualizado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.status(200).json({ 
            mensaje: 'Perfil actualizado con éxito', 
            usuario: usuarioActualizado 
        });

    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor al actualizar el perfil' });
    }
};

// Endpoint para obtener un usuario por su ID
exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        // .populate busca en la tabla de Recetas la foto de la receta y traemos la foto para la página de detalle
        const usuario = await Usuario.findById(req.params.id)
            .populate('recetasGuardadas')  // Se muestran las recetas guardadas
            .select('-password'); // No se envía la contraseña por motivo de seguridad

        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuario' });
    }
};

// FUNCIÓN toggleGuardarReceta
exports.toggleGuardarReceta = async (req, res) => {
    try {
        const { recetaId } = req.body;
        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        // Si el cajón de favoritos no existe, lo creamos
        if (!usuario.recetasGuardadas) {
            usuario.recetasGuardadas = [];
        }

        // Buscamos si la receta ya está en la lista
        const index = usuario.recetasGuardadas.indexOf(recetaId);

        if (index === -1) {
            // NO ESTÁ: La añadimos
            usuario.recetasGuardadas.push(recetaId);
            await usuario.save();
            console.log("Receta añadida a favoritos");
            return res.status(200).json({ mensaje: "Guardada", guardada: true });
        } else {
            // SÍ ESTÁ: La quitamos
            usuario.recetasGuardadas.splice(index, 1);
            await usuario.save();
            console.log("Receta quitada de favoritos");
            return res.status(200).json({ mensaje: "Quitada", guardada: false });
        }
    } catch (error) {
        console.error("Error en toggleGuardarReceta:", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};