import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importamos las páginas
import Inicio from './pages/Inicio';
import Acceso from './pages/Acceso';
import EditorReceta from './pages/EditorReceta';
import DetalleReceta from './pages/DetalleReceta';
import MiCuenta from './pages/MiCuenta';   
import FavoritosGuardados from './pages/FavoritosGuardados';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/acceso" element={<Acceso />} />
        {/* 2. Cuando vayamos a /nueva-receta, mostramos el EditorReceta */}
        <Route path="/nueva-receta" element={<EditorReceta />} />
        <Route path="/receta/:id" element={<DetalleReceta />} /> 
        <Route path="/mi-cuenta" element={<MiCuenta />} />
        <Route path="/mis-favoritos" element={<FavoritosGuardados />} />
      </Routes>
    </Router>
  );
}

export default App;