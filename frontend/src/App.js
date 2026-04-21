import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importamos las páginas
import Inicio from './pages/Inicio';
import Acceso from './pages/Acceso';

function App() {
  return (
    <Router>
      {/* Aquí puedes poner tu Navbar si quieres que se vea en TODAS las páginas */}
      <Routes>
        {/* Ruta principal: muestra tus recetas */}
        <Route path="/" element={<Inicio />} />
        
        {/* Ruta de acceso: muestra el login/registro que creamos */}
        <Route path="/acceso" element={<Acceso />} />
      </Routes>
    </Router>
  );
}

export default App;