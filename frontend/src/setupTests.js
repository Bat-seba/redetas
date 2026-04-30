// *********************************************************************************************************************
//  RUTA: frontend/src/setupTests.js
// 
// 🔹 Este archivo configura el entorno de pruebas global para la aplicación.
// 🔹 Extiende las capacidades de Jest con aserciones específicas para el DOM proporcionadas por Testing Library.
// *********************************************************************************************************************

/**
 * @fileoverview Configuración inicial del entorno de testing (Jest).
 * Importa el paquete 'jest-dom' para habilitar comparadores (matchers) personalizados que facilitan 
 * la evaluación y aserción sobre nodos del DOM (por ejemplo: expect(element).toBeInTheDocument()).
 * @author Bat-seba Rodríguez Moreno
 * @see https://github.com/testing-library/jest-dom
 */

import '@testing-library/jest-dom';