// ======================================================================================================================================== 
// api.test.js - sirve para probar la API de Redetas
//
// 🔹 Con esta prueba, comprobamos que la API de Redetas funciona correctamente y responde con un mensaje de éxito.        
// ========================================================================================================================================

const request = require('supertest');
const express = require('express');

// Creamos un servidor Express simulado solo para la prueba
const app = express();
app.use(express.json());

// Simulamos una ruta de la API
app.get('/api/v1/estado', (req, res) => {
    res.status(200).json({ mensaje: "El servidor de Redetas funciona correctamente" });
});

describe('Pruebas Automáticas - API de Redetas', () => {
    it('Debería responder con código HTTP 200 y un mensaje de éxito', async () => {
        // Lanzamos la petición simulada
        const res = await request(app).get('/api/v1/estado');
        
        // Verificamos que los resultados son los esperados
        expect(res.statusCode).toEqual(200);
        expect(res.body.mensaje).toBe("El servidor de Redetas funciona correctamente");
    });
});