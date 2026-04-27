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

exports.obtenerUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select('-password');
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los datos del usuario' });
    }
};