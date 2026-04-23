// ==========================================================================================================================================
// ARCHIVO: index.js es el primer archivo de JavaScript que se ejecuta cuando alguien entra en la web.
//
// 🔹 Su función es crear un "puente" entre el código moderno de React (<App />) y el archivo HTML.
// ==========================================================================================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';    // Se importa el componente principal de la aplicación.
import reportWebVitals from './reportWebVitals';   // Se importan las herramientas de medición de rendimiento de la web.

// Se busca en el archivo HTML (public/index.html) el elemento con el ID "root" (id="root") para decirle a React que esta será la raíz de la web.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Se renderiza el componente principal de la aplicación en la raíz de la web. StrictMode es un modo de desarrollo que ayuda a encontrar problemas de rendimiento.
root.render(
  <React.StrictMode>  
    <App />
  </React.StrictMode>
);

// -------------------------------------------------------------------------------- 
// MEDICIÓN DE RENDIMIENTO (Web Vitals)
// --------------------------------------------------------------------------------
// Si se desea empezar a medir el rendimiento de la aplicación, pasa una función 
// para registrar los resultados (por ejemplo: reportWebVitals(console.log)) 
// o envíalos a un servicio de análisis web (como Google Analytics). 
// Leer en: https://bit.ly/CRA-vitals
reportWebVitals();
