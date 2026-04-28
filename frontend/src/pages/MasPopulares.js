// ==========================================================================================================================================
// ARCHIVO: MasPopulares.js - Ranking de recetas con más Yummys
// ==========================================================================================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logoPng from '../components/logo.png';
import '../App.css';

function MasPopulares() {
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioRedetas'));
  const [recetasTop, setRecetasTop] = useState([]);
  const [datosUsuarioHeader, setDatosUsuarioHeader] = useState(null);

  useEffect(() => {
    // Scroll arriba al cargar
    window.scrollTo(0, 0);

    const cargarDatos = async () => {
      try {
        // 1. Traemos todas las recetas
        const res = await axios.get('http://localhost:3000/api/v1/recetas');
        
        // 2. Las ordenamos de mayor a menor número de yummys
        const recetasOrdenadas = res.data.sort((a, b) => {
          const yummysA = a.yummys ? a.yummys.length : 0;
          const yummysB = b.yummys ? b.yummys.length : 0;
          return yummysB - yummysA; 
        });

        // 3. Nos quedamos solo con el Top 10 
        setRecetasTop(recetasOrdenadas.slice(0, 10));

        // 4. Cargamos el usuario para el header
        if (usuarioLogueado) {
          const id = usuarioLogueado._id || usuarioLogueado.id;
          const resUser = await axios.get(`http://localhost:3000/api/v1/usuarios/${id}`);
          setDatosUsuarioHeader(resUser.data);
        }
      } catch (err) {
        console.error("Error cargando el ranking", err);
      }
    };
    cargarDatos();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioRedetas');
    window.location.href = '/';
  };

  return (
    <div style={{ backgroundColor: '#fdfaf7', minHeight: '100vh' }}>
      
      {/* HEADER SIMPLIFICADO */}
      <header className="main-header">
        <div className="header-container">
          <Link to="/" className="logo-container">
            <img src={logoPng} alt="Logo Redetas" className="logo-image" />
          </Link>
          <nav className="nav-links">
            <Link to="/">Inicio</Link>
            <Link to="/mas-populares" style={{ color: '#D35400', fontWeight: 'bold' }}>Más populares</Link>
            <Link to="/sobre-redetas">Sobre Redetas</Link>
          </nav>
          <div className="header-actions">
            <Link to="/nueva-receta" className="publish-button">Publicar Receta</Link>
            {usuarioLogueado ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px' }}>
                <Link to="/mi-cuenta" style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#D35400', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '22px', fontWeight: 'bold', border: '2px solid white', overflow: 'hidden', textDecoration: 'none' }}>
                  {datosUsuarioHeader?.foto_perfil_url ? (
                    <img src={`http://localhost:3000/uploads/${datosUsuarioHeader.foto_perfil_url}`} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    usuarioLogueado.username.charAt(0).toUpperCase()
                  )}
                </Link>
              </div>
            ) : (
              <Link to="/acceso" style={{ fontWeight: 'bold', color: '#D35400', fontSize: '20px', textDecoration: 'none', marginLeft: '15px' }}>Entrar</Link>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '42px', color: '#333', marginBottom: '10px' }}>🏆 Salón de la Fama</h1>
          <p style={{ fontSize: '20px', color: '#666' }}>Aquí tienes colocadas las recetas con más yummys de toda la comunidad.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {recetasTop.map((receta, index) => {
            // Estilos dinámicos según la posición
            let fondoPosicion = '#f0f0f0';
            let medalla = `# ${index + 1}`;
            let bordeTarjeta = '1px solid #eee';

            if (index === 0) { medalla = '🥇 1º'; fondoPosicion = '#FFD700'; bordeTarjeta = '3px solid #FFD700'; } // Oro
            else if (index === 1) { medalla = '🥈 2º'; fondoPosicion = '#E0E0E0'; bordeTarjeta = '3px solid #C0C0C0'; } // Plata
            else if (index === 2) { medalla = '🥉 3º'; fondoPosicion = '#CD7F32'; bordeTarjeta = '3px solid #CD7F32'; } // Bronce

            return (
              <div key={receta._id} style={{ display: 'flex', backgroundColor: 'white', borderRadius: '15px', padding: '20px', alignItems: 'center', gap: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', border: bordeTarjeta, transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                
                {/* Posición / Medalla */}
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: fondoPosicion, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: index < 3 ? '24px' : '20px', fontWeight: 'bold', color: index < 3 ? 'white' : '#666', flexShrink: 0, textShadow: index < 3 ? '1px 1px 2px rgba(0,0,0,0.2)' : 'none' }}>
                  {medalla}
                </div>

                {/* Foto miniatura */}
                <div style={{ width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={`http://localhost:3000/uploads/${receta.imagen}`} alt={receta.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Info Receta */}
                <div style={{ flexGrow: 1 }}>
                  <Link to={`/receta/${receta._id}`} style={{ textDecoration: 'none', color: '#333' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>{receta.titulo}</h3>
                  </Link>
                  <p style={{ margin: 0, color: '#888', fontSize: '16px' }}>Por <span style={{ fontWeight: 'bold', color: '#D35400' }}>{receta.nombreAutor}</span></p>
                </div>

                {/* Contador gigante de Yummys */}
                <div style={{ textAlign: 'center', flexShrink: 0, padding: '0 20px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#D35400' }}>
                    {receta.yummys ? receta.yummys.length : 0}
                  </div>
                  <div style={{ fontSize: '14px', color: '#888' }}>😋 Yummys</div>
                </div>

                {/* Botón Ver */}
                <Link to={`/receta/${receta._id}`} style={{ flexShrink: 0 }}>
                  <button style={{ backgroundColor: '#D35400', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>VER</button>
                </Link>
                
              </div>
            );
          })}
        </div>

        {recetasTop.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#888', fontSize: '18px' }}>
            Todavía no hay recetas para mostrar en el ranking.
          </div>
        )}

      </main>
    </div>
  );
}

export default MasPopulares;