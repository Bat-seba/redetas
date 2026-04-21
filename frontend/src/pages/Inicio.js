// ==========================================================================================================================================
// ARCHIVO: Inicio.js - Componente de la pantalla principal.
// ==========================================================================================================================================

import React from 'react';
import { Link } from 'react-router-dom';

// Importación de componentes y recursos
import Formulario from '../components/Formulario';
import logoPng from '../components/logo.png'; 
import '../App.css';

function Inicio() {
  
  // 🟢 COSA 1: LEER LA MEMORIA
  // Intentamos obtener el usuario que guardamos en Acceso.js
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioRedetas'));

  // Función extra: Para poder cerrar sesión y probar de nuevo
  const cerrarSesion = () => {
    localStorage.removeItem('usuarioRedetas'); // Borramos el rastro
    window.location.reload(); // Recargamos la página para que vuelva a salir "Entrar"
  };

  return (
    <>
      <header className="main-header">
        <div className="header-container">
          <Link to="/" className="logo-container">
            <img src={logoPng} alt="Logo Redetas" className="logo-image" />
          </Link>
          
          <nav className="nav-links">
            <Link to="/">Inicio</Link>
            <Link to="/#">Recetas</Link>
            <Link to="/#">Comunidad</Link>
            <Link to="/#">Blog</Link>

            {/* 🟢 COSA 2: MENÚ INTELIGENTE */}
            {usuarioLogueado ? (
              // Si el usuario existe en la memoria, mostramos su nombre
              <>
                <Link to="/mi-cuenta" style={{fontWeight: 'bold', color: '#D35400'}}>
                  Hola, {usuarioLogueado.username}
                </Link>
                {/* Botoncito discreto para salir */}
                <button onClick={cerrarSesion} style={{marginLeft: '10px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '12px'}}>
                  (Salir)
                </button>
              </>
            ) : (
              // Si no hay nadie, mostramos el botón de "Entrar" de siempre
              <Link to="/acceso" style={{fontWeight: 'bold', color: '#D35400'}}>Entrar</Link>
            )}
          </nav>
          
          <div className="header-actions">
            <input type="search" placeholder="Buscar recetas..." className="search-bar" />
            <Link to="/nueva-receta" className="publish-button">
              Publicar Receta
            </Link>
          </div>
        </div>
      </header>

      <main className="main-content">
        <h1>Últimas Recetas</h1>
        <p>Bienvenido a Redetas. Aquí se cargará tu catálogo de recetas.</p>
      </main>
    </>
  );
}

export default Inicio;