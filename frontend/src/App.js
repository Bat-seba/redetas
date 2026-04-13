// ==========================================================================================================================================
// ARCHIVO: App.js es el componente principal o raíz de la interfaz en React.
//
// 🔹 Su función principal es organizar el diseño general de la web (Layout) y controlar la navegación (Routing).
//     Mantiene la cabecera siempre visible y decide qué pantalla mostrar en la zona central dependiendo de la URL en la que esté el usuario.
// 
// 🔹 Gracias a 'react-router-dom', REDETAS funciona como una SPA (Single Page Application). Esto significa que la web no se recarga por
//     completo al cambiar de página, ofreciendo una experiencia mucho más rápida y fluida.
// ==========================================================================================================================================


import React from 'react';

// Importación de las herramientas de navegación para moverse entre las distintas pantallas sin recargar la web
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Importación de las diferentes pantallas o componentes de la aplicación
import Inicio from './components/Inicio';
import Formulario from './components/Formulario';

// Importación de los recursos visuales (en este caso el logo) y los estilos CSS globales
import logoPng from './components/logo.png'; 
import './App.css';

/**
 * Función principal del componente App que renderiza la interfaz de la aplicación.
 * 
 * @returns {JSX.Element} La interfaz de la aplicación.
 */
function App() {
  return (
    <BrowserRouter>
      {/* Cabecera fija con el logo y el menú de navegación que se verá en todas las pantallas de la aplicación */}   
      <header className="main-header">
        <div className="header-container">

          {/* Enlace que contiene el logo que conduce al inicio de la aplicación al hacer clic en el mismo. Uso de link para navegar sin recargar la web  */}
          <Link to="/" className="logo-container">
            <img src={logoPng} alt="Logo Redetas" className="logo-image" />
          </Link>
          
          {/* Menú de navegación principal con enlaces a distintas secciones de la aplicación */}
          <nav className="nav-links">
            <Link to="/">Inicio</Link>
            <Link to="/#">Recetas</Link>
            <Link to="/#">Comunidad</Link>
            <Link to="/#">Blog</Link>
          </nav>
          
          {/* Formulario de búsqueda y botón de publicación de recetas */}
          <div className="header-actions">
            <input type="search" placeholder="Buscar recetas..." className="search-bar" />
            <Link to="/nueva-receta" className="publish-button">
              Publicar Receta
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENIDO DINAMICO (MAIN CONTENT): Contenedor principal que contiene las rutas de la aplicación y cambia dependiendo de la URL */}
      <main className="main-content">
        <Routes>
          {/* Ruta al inicio raíz ("/") donde React renderiza el componente <Inicio/> */}
          <Route path="/" element={<Inicio />} />
          {/* Ruta al formulario de creación de recetas ("/nueva-receta") donde React renderiza el componente <Formulario/> */}
          <Route path="/nueva-receta" element={<Formulario />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;