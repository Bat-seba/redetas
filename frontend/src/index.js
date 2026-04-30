// *********************************************************************************************************************
//  RUTA: frontend/src/index.js
//
// 🔹 Este archivo constituye el punto de entrada principal (Entry Point) de la aplicación React.
// 🔹 Su función es inicializar y montar el árbol de componentes virtual en el DOM real del navegador.
// *********************************************************************************************************************

/**
 * @fileoverview Punto de inicialización y montaje de la aplicación React.
 * Enlaza el componente raíz (<App />) con el documento HTML subyacente y configura la medición de métricas de rendimiento.
 * @author Bat-seba Rodríguez Moreno
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

// Importación de los estilos globales fundamentales
import './index.css';

// Importación del componente estructural principal de la aplicación
import App from './App';    

// Importación del módulo para el registro y auditoría de las Core Web Vitals
import reportWebVitals from './reportWebVitals';   

/**
 * Creación del nodo raíz de React.
 * Vincula el motor de renderizado de React con el contenedor físico <div id="root"> 
 * definido estáticamente en el archivo public/index.html.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * Inyección y renderizado del árbol de componentes en el DOM real.
 * La implementación de <React.StrictMode> habilita comprobaciones adicionales y 
 * advertencias durante el ciclo de desarrollo para detectar efectos secundarios impuros y APIs obsoletas.
 */
root.render(
    <React.StrictMode>  
        <App />
    </React.StrictMode>
);

/**
 * Inicialización de la captura de métricas de rendimiento (Web Vitals).
 * Permite registrar o derivar los resultados de carga y experiencia de usuario a un 
 * servicio de analítica externo (ej. Google Analytics) inyectando un callback como reportWebVitals(console.log).
 * 
 * @see https://bit.ly/CRA-vitals
 */
reportWebVitals();