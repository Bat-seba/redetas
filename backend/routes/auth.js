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

    // 1. Comprobamos si el usuario o el email ya existen en la base de datos
    const usuarioExistente = await Usuario.findOne({ $or: [{ email }, { username }] });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email o el nombre de usuario ya están en uso.' });
    }

    // 2. Encriptamos la contraseña (el número 10 es el "costo" de la encriptación, es el estándar)
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // 3. Creamos el nuevo usuario con la contraseña secreta
    const nuevoUsuario = new Usuario({
      username,
      email,
      password: passwordEncriptada
    });

    // 4. Lo guardamos en MongoDB
    await nuevoUsuario.save();

    // 5. Respondemos al Frontend que todo ha ido genial (Código 201 Created)
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

    // 1. Buscamos al usuario por su email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales incorrectas.' });
    }

    // 2. Comparamos la contraseña que ha escrito con la encriptada de la base de datos
    const esPasswordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esPasswordCorrecta) {
      return res.status(400).json({ mensaje: 'Credenciales incorrectas.' });
    }

    // 3. Si todo está bien, le damos la bienvenida (Código 200 OK)
    res.status(200).json({ 
      mensaje: 'Inicio de sesión exitoso',
      usuario: { id: usuario._id, username: usuario.username, email: usuario.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

module.exports = router;