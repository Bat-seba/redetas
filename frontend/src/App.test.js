// *********************************************************************************************************************
//  RUTA: frontend/src/App.test.js
// 
// 🔹 Este archivo contiene las pruebas unitarias iniciales para el componente principal de la aplicación.
// *********************************************************************************************************************

/**
 * @fileoverview Pruebas unitarias para el componente App generadas por defecto.
 * Utiliza React Testing Library para verificar el renderizado del DOM de la plantilla base.
 * @author Bat-seba Rodríguez Moreno
 */

import { render, screen } from '@testing-library/react';
import App from './App';

/**
 * Caso de prueba por defecto.
 * Renderiza el componente App y verifica la existencia de un elemento específico en el árbol del DOM.
 * Nota técnica: Este test corresponde a la estructura inicial de Create React App y evaluará el texto base.
 */
test('renders learn react link', () => {
    // Renderizado del componente principal en el entorno de DOM virtual (JSDOM)
    render(<App />);
    
    // Búsqueda del elemento de texto utilizando una expresión regular (case-insensitive)
    const linkElement = screen.getByText(/learn react/i);
    
    // Aserción del test: valida que el elemento coincidente exista dentro del documento renderizado
    expect(linkElement).toBeInTheDocument();
});