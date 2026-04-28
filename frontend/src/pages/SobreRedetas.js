// ==========================================================================================================================================
// ARCHIVO: SobreRedetas.js - Presentación del proyecto y la autora
// ==========================================================================================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import logoPng from '../components/logo.png';
import '../App.css';
import MiFoto from '../components/MiFoto.jpg';

function SobreRedetas() {
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioRedetas'));

  return (
    <div style={{ backgroundColor: '#fdfaf7', minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* HEADER LIMPIO */}
      <header className="main-header">
        <div className="header-container">
          <Link to="/" className="logo-container">
            <img src={logoPng} alt="Logo Redetas" className="logo-image" />
          </Link>
          <nav className="nav-links">
            <Link to="/">Inicio</Link>
            <Link to="/mas-populares">Más populares</Link>
            <Link to="/sobre-redetas" style={{ color: '#D35400', fontWeight: 'bold' }}>Sobre Redetas</Link>
          </nav>
          <div className="header-actions">
            {usuarioLogueado ? (
               <Link to="/nueva-receta" className="publish-button">Publicar Receta</Link>
            ) : (
              <Link to="/acceso" style={{ fontWeight: 'bold', color: '#D35400', fontSize: '20px', textDecoration: 'none' }}>Entrar</Link>
            )}
          </div>
        </div>
      </header>

      {/* CUERPO DE LA PÁGINA */}
      <main style={{ maxWidth: '800px', margin: '60px auto', padding: '0 20px' }}>
        
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '50px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <h1 style={{ fontSize: '38px', color: '#D35400', marginBottom: '20px' }}>Sobre Redetas</h1>
          <p style={{ fontSize: '20px', color: '#555', lineHeight: '1.6', marginBottom: '40px' }}>
            Redetas es un proyecto nacido de la necesidad de crear una comunidad culinaria inclusiva, donde las personas con restricciones alimentarias puedan encontrar y compartir recetas deliciosas y seguras.
          </p>

          <hr style={{ border: 'none', borderTop: '2px dashed #eee', marginBottom: '40px' }} />

          <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '20px' }}>La Desarrolladora</h2>
          
          
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%', // Forma circular perfecta
            margin: '0 auto 20px auto', // Centrado horizontal en la página y separación abajo
            border: '4px solid #D35400', // El borde naranja VISUAL (se aplica aquí, no en la imagen)
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)', // La sombra se aplica aquí
            overflow: 'hidden', // IRecorta la imagen de adentro para que siga la forma circular
            }}>
            <img
              src={MiFoto}
              alt="Desarrolladora del proyecto"
              style={{
                width: '100%', // Se ajusta al ancho total del contenedor (menos los bordes)
                height: '100%', // Se ajusta al alto total
                objectFit: 'cover', // Mantiene la relación de aspecto sin deformar la foto
            }}
            />
          </div>
          
          <h3 style={{ fontSize: '26px', margin: '0 0 10px 0', color: '#D35400' }}>Bat-seba Rodríguez Moreno</h3>
          <p style={{ fontSize: '18px', color: '#777', marginBottom: '30px' }}>Creadora y Desarrolladora Full Stack</p>

          <div style={{ textAlign: 'left', backgroundColor: '#fdf8f5', padding: '30px', borderRadius: '15px', color: '#555', fontSize: '18px', lineHeight: '1.7' }}>
            <p style={{ margin: 0 }}>
              Este proyecto ha sido desarrollado como Trabajo de Fin de Grado, ahora llamado <strong> Proyecto Intermodular de Desarrollo de Aplicaciones Web</strong>. Mi objetivo ha sido aplicar todos los conocimientos 
              adquiridos en la formación profesional, desde el diseño de la base de datos en MongoDB hasta la lógica del servidor en Node.js y la interfaz de usuario con React.
            </p>
          </div>

          <div style={{ marginTop: '50px' }}>
            <h4 style={{ fontSize: '16px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '25px' }}>Tecnologías utilizadas</h4>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <span style={badgeStyle}>JavaScript (ES6+)</span>
              <span style={badgeStyle}>React</span>
              <span style={badgeStyle}>Node.js</span>
              <span style={badgeStyle}>Express</span>
              <span style={badgeStyle}>MongoDB</span>
              <span style={badgeStyle}>Axios</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const badgeStyle = {
  backgroundColor: '#333',
  color: 'white',
  padding: '8px 18px',
  borderRadius: '20px',
  fontWeight: 'bold',
  fontSize: '14px'
};

export default SobreRedetas;