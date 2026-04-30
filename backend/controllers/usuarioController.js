// *********************************************************************************************************************
//  RUTA: backend/controllers/usuarioController.js 
// 
// 🔹 Este archivo sirve para actualizar el perfil del usuario en la base de datos.
// *********************************************************************************************************************

/**
 * @fileoverview Controlador para la gestión de la entidad Usuario.
 * Maneja la actualización de perfiles, gestión de contraseñas, colecciones de favoritos y permisos administrativos.
 * @author Bat-seba Rodríguez Moreno
 */

const Usuario = require('../models/Usuario');
const Receta = require('../models/Receta');
const bcrypt = require('bcrypt'); // Librería criptográfica para el hashing de contraseñas

// =========================================================================
// 1. ACTUALIZAR PERFIL DE USUARIO
// =========================================================================

/**
 * Actualiza los datos personales de un usuario (username, bio y foto de perfil).
 * Incluye validación contra duplicidad de nombres de usuario en la base de datos.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.actualizarPerfil = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, bio, borrar_foto } = req.body; 
        
        let updateData = {};
        
        // Validación de unicidad para el nombre de usuario (evita duplicados)
        if (username) {
            const usuarioExistente = await Usuario.findOne({ username, _id: { $ne: userId } });
            
            if (usuarioExistente) {
                return res.status(400).json({ mensaje: 'Ese nombre de usuario ya está en uso por otra persona.' });
            }
            
            updateData.username = username;
        }

        if (bio !== undefined) {
            updateData.bio = bio;
        }

        // Gestión del archivo multimedia (foto de perfil)
        if (req.file) {
            updateData.foto_perfil_url = req.file.filename;
        } else if (borrar_foto === 'true') {
            updateData.foto_perfil_url = ''; 
        }

        // Ejecución de la actualización devolviendo el documento modificado y excluyendo la contraseña
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            userId,
            updateData,
            { new: true } 
        ).select('-password');

        if (!usuarioActualizado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (username) {
            await Receta.updateMany(
                { autor: userId },       
                { nombreAutor: username }
            );
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

// =========================================================================
// 2. OBTENER DETALLE DE USUARIO (POR ID)
// =========================================================================

/**
 * Obtiene la información pública y la colección de recetas guardadas de un usuario.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        // La consulta expande (populate) el array de referencias a los documentos completos de Recetas
        const usuario = await Usuario.findById(req.params.id)
            .populate('recetasGuardadas') 
            .select('-password'); 

        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuario' });
    }
};

// =========================================================================
// 3. GESTIÓN DE FAVORITOS (GUARDAR/QUITAR RECETA)
// =========================================================================

/**
 * Alterna el estado de una receta dentro de la colección personal de favoritos del usuario.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.toggleGuardarReceta = async (req, res) => {
    try {
        const { recetaId } = req.body;
        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        // Inicialización segura del array de favoritos si no existe
        if (!usuario.recetasGuardadas) {
            usuario.recetasGuardadas = [];
        }

        const index = usuario.recetasGuardadas.indexOf(recetaId);

        // Lógica de alternancia (Push si no existe, Splice si ya existe)
        if (index === -1) {
            usuario.recetasGuardadas.push(recetaId);
            await usuario.save();
            return res.status(200).json({ mensaje: "Guardada", guardada: true });
        } else {
            usuario.recetasGuardadas.splice(index, 1);
            await usuario.save();
            return res.status(200).json({ mensaje: "Quitada", guardada: false });
        }
    } catch (error) {
        console.error("Error en toggleGuardarReceta:", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// =========================================================================
// 4. ACTUALIZACIÓN DE SEGURIDAD (CAMBIO DE CONTRASEÑA)
// =========================================================================

/**
 * Modifica la contraseña del usuario tras validar criptográficamente la contraseña actual.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.actualizarPassword = async (req, res) => {
    try {
        const { passwordAnterior, passwordNueva } = req.body;
        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Validación del hash almacenado frente a la contraseña en texto plano ingresada
        const esCorrecta = await bcrypt.compare(passwordAnterior, usuario.password);
        
        if (!esCorrecta) {
            return res.status(400).json({ mensaje: 'La contraseña actual no es correcta' });
        }

        // Generación del nuevo hash criptográfico (Coste computacional: 10)
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(passwordNueva, salt);

        await usuario.save();
        res.status(200).json({ mensaje: 'Contraseña actualizada con éxito' });

    } catch (error) {
        console.error("Error en controlador actualizarPassword:", error); 
        res.status(500).json({ mensaje: 'Error interno del servidor al cambiar contraseña' });
    }
};

// =========================================================================
// 5. ELIMINACIÓN DE CUENTA DE USUARIO
// =========================================================================

/**
 * Borra permanentemente el registro de un usuario en el sistema.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await Usuario.findByIdAndDelete(id);
        res.status(200).json({ mensaje: 'Cuenta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la cuenta' });
    }
};

// =========================================================================
// 6. ADMINISTRACIÓN (OBTENER TODOS LOS USUARIOS)
// =========================================================================

/**
 * Obtiene el listado completo de usuarios registrados.
 * Ruta de acceso restringido para uso exclusivo en paneles de administración.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.obtenerTodosLosUsuarios = async (req, res) => {
    try {
        // Exclusión explícita de campos sensibles (password) en la respuesta global
        const usuarios = await Usuario.find().select('-password');
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
        res.status(500).json({ mensaje: 'Error interno al obtener usuarios' });
    }
};