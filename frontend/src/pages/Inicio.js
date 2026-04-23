// ==========================================================================================================================================
// ARCHIVO: Inicio.js - Componente de la pantalla principal.
// ==========================================================================================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 

// Importación de componentes y recursos
import Formulario from '../components/Formulario';
import logoPng from '../components/logo.png'; 
import '../App.css';
import '../components/Inicio.css'; // Importa tus estilos CSS

// Importamos tus iconos reales
import iconoSinAzucar from '../components/iconos/icono_sin_azucar.png';
import iconoSinFrutosSecos from '../components/iconos/icono_sin_frutos_secos.png';
import iconoSinGluten from '../components/iconos/icono_sin_gluten.png';
import iconoSinHarinas from '../components/iconos/icono_sin_harinas.png';
import iconoSinHuevo from '../components/iconos/icono_sin_huevo.png';
import iconoSinLeche from '../components/iconos/icono_sin_leche.png';

function Inicio() {
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioRedetas'));
  const [recetas, setRecetas] = useState([]);

  // Mapa para relacionar el texto de la base de datos de la imagen
  const mapaIconos = {
    "Sin gluten": iconoSinGluten,
    "Sin huevo": iconoSinHuevo,
    "Sin leche": iconoSinLeche,
    "Sin azúcar": iconoSinAzucar,
    "Sin harinas": iconoSinHarinas,
    "Sin frutos secos": iconoSinFrutosSecos
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioRedetas'); 
    window.location.reload(); 
  };

  useEffect(() => {
    const cargarRecetas = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/recetas');
        setRecetas(res.data);
      } catch (err) {
        console.error("Error cargando recetas", err);
      }
    };
    cargarRecetas();
  }, []);

  const recortarInstrucciones = (texto) => {
    if (!texto) return "";
    const frases = texto.split('.'); 
    if (frases.length <= 2) return texto;
    return frases.slice(0, 2).join('.') + '...';
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

            {usuarioLogueado ? (
              <>
                <Link to="/mi-cuenta" style={{fontWeight: 'bold', color: '#D35400'}}>
                  Hola, {usuarioLogueado.username}
                </Link>
                <button onClick={cerrarSesion} style={{marginLeft: '10px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '12px'}}>
                  (Salir)
                </button>
              </>
            ) : (
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
        <h1 className="main-title">Últimas Recetas</h1>
        
        <div className="recetas-grid">
          
          {recetas.map((receta) => (
            <div key={receta._id} className="receta-card">
              
              {/* FOTO con Link clickable a la receta en particular. */}
              <div className="card-image-container">
                <Link to={`/receta/${receta._id}`}>
                  <img 
                    src={`http://localhost:3000/uploads/${receta.imagen}`} 
                    alt={receta.titulo} 
                    className="card-image" 
                  />
                </Link>
              </div>

              <div className="card-content">
                
                {/* 1. TÍTULO */}
                <Link to={`/receta/${receta._id}`} style={{ textDecoration: 'none' }}>
                  <h3 className="card-title">{receta.titulo.toUpperCase()}</h3>
                </Link>

                {/* 3. BARRA SOCIAL: AUTOR (Izq) Y YUMMYS (Der) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                  <Link to={`/perfil/${receta.autor}`} style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#D35400', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                      {receta.nombreAutor ? receta.nombreAutor.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{receta.nombreAutor}</span>
                  </Link>
                  <div style={{ color: '#D35400', fontWeight: 'bold', fontSize: '18px' }}>
                    {receta.yummys || 0} 😋
                  </div>
                </div>

                {/* 4. CARACTERÍSTICAS (Con cartelitos instantáneos) */}
                <div className="apto-iconos">
                  {receta.categorias && receta.categorias.map(cat => (
                    <div key={cat} className="contenedor-icono-magico">
                      <img 
                        src={mapaIconos[cat]} 
                        alt={cat} 
                        className="icono-categoria-img" 
                      />
                      <span className="texto-flotante">{cat}</span>
                    </div>
                  ))}
                </div>

                {/* 5. INSTRUCCIONES RECORTADAS */}
                <p className="card-description">
                  {recortarInstrucciones(receta.instrucciones)}
                </p>

                {/* 6. BOTÓN VER RECETA */}
                <Link to={`/receta/${receta._id}`} style={{ textDecoration: 'none', marginTop: 'auto' }}>
                  <button className="btn-view-recipe">
                    VER RECETA
                  </button>
                </Link>

              </div>
            </div>
          ))}

        </div>
      </main>
    </>
  );
}

export default Inicio;