// *********************************************************************************************************************
//  RUTA: backend/routes/auth.js
// 
// 🔹 Este archivo gestiona las rutas de autenticación y registro de usuarios en la plataforma.
// *********************************************************************************************************************

/**
 * @fileoverview Enrutador para los procesos de autenticación y gestión de accesos.
 * Define los endpoints HTTP requeridos para el registro de nuevas cuentas y el inicio de sesión.
 * @author Bat-seba Rodríguez Moreno
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

// ==========================================
// RUTA 1: REGISTRAR UN NUEVO USUARIO
// ENDPOINT: POST /api/v1/auth/registro
// ==========================================
router.post('/registro', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verificación de unicidad en la base de datos (evita duplicidad de email o username)
        const usuarioExistente = await Usuario.findOne({ $or: [{ email }, { username }] });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El email o el nombre de usuario ya están en uso.' });
        }

        // Generación del hash criptográfico para la contraseña (factor de coste: 10)
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // Instanciación del modelo de datos con la contraseña cifrada
        const nuevoUsuario = new Usuario({
            username,
            email,
            password: passwordEncriptada
        });

        // Persistencia del documento en MongoDB
        await nuevoUsuario.save();

        // Respuesta HTTP de éxito indicando la creación del recurso
        res.status(201).json({ mensaje: 'Usuario registrado con éxito.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});

// ==========================================
// RUTA 2: INICIAR SESIÓN
// ENDPOINT: POST /api/v1/auth/login
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Búsqueda del documento del usuario mediante el correo electrónico introducido
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Credenciales incorrectas.' });
        }

        // Validación criptográfica de la contraseña introducida frente al hash almacenado
        const esPasswordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!esPasswordCorrecta) {
            return res.status(400).json({ mensaje: 'Credenciales incorrectas.' });
        }

        // Respuesta exitosa devolviendo el payload del usuario autenticado (excluyendo el hash de la contraseña)
        res.status(200).json({ 
            mensaje: 'Inicio de sesión exitoso',
            usuario: { 
                id: usuario._id, 
                username: usuario.username, 
                email: usuario.email,
                rol: usuario.rol 
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});

module.exports = router;