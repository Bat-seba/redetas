import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importamos las páginas
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