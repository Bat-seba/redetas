// *********************************************************************************************************************
//  RUTA: frontend/src/App.js
// 
// 🔹 Este archivo es el punto de entrada de enrutamiento principal de la aplicación.
// 🔹 Configura las rutas de React Router para la navegación entre las distintas páginas del proyecto.
// *********************************************************************************************************************

/**
 * @fileoverview Configuración global de enrutamiento del lado del cliente.
 * Importa y asocia los componentes de vista superior con sus respectivas rutas URL.
 * @author Bat-seba Rodríguez Moreno
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importación estática de las vistas (Páginas) de la aplicación
import Inicio from './pages/Inicio';
import Acceso from './pages/Acceso';
import EditorReceta from './pages/EditorReceta';
import DetalleReceta from './pages/DetalleReceta';
import MiCuenta from './pages/MiCuenta';   
import FavoritosGuardados from './pages/FavoritosGuardados';
import PerfilPublico from './pages/PerfilPublico';
import Configuracion from './pages/Configuracion';
import AdminPanel from './pages/AdminPanel';
import MasPopulares from './pages/MasPopulares';
import SobreRedetas from './pages/SobreRedetas';

/**
 * Componente principal App.
 * Actúa como contenedor central del enrutador de la interfaz de usuario.
 * 
 * @returns {JSX.Element} Árbol de enrutamiento principal.
 */
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/acceso" element={<Acceso />} />
                <Route path="/nueva-receta" element={<EditorReceta />} />
                <Route path="/receta/:id" element={<DetalleReceta />} /> 
                <Route path="/mi-cuenta" element={<MiCuenta />} />
                <Route path="/mis-favoritos" element={<FavoritosGuardados />} />
                <Route path="/usuario/:id" element={<PerfilPublico />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/mas-populares" element={<MasPopulares />} />
                <Route path="/sobre-redetas" element={<SobreRedetas />} />
            </Routes>
        </Router>
    );
}

export default App;