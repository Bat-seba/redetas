// ==========================================================================================================================================
// ARCHIVO: Inicio.js - Componente de la pantalla principal.
// ==========================================================================================================================================

import React, { useState, useEffect, useRef } from 'react'; // Importo useRef para los click fuera del menú desplegable
import { Link } from 'react-router-dom';
import axios from 'axios'; 

// Importación de componentes y recursos
import Formulario from '../components/Formulario';
import logoPng from '../components/logo.png'; 
import '../App.css';
import '../components/Inicio.css'; // Se importa los estilos CSS

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

// REFERENCIAS PARA DETECTAR CLICS FUERA
  const buscadorRef = useRef(null);
  const perfilRef = useRef(null);

  useEffect(() => {
    const gestionarClicFuera = (evento) => {
      // Si el clic NO está dentro del contenedor del buscador, cerramos sus desplegables
      if (buscadorRef.current && !buscadorRef.current.contains(evento.target)) {
        setMenuFiltrosAbierto(false);
        setMostrarSugerencias(false); // 🟢 LÍNEA NUEVA: Esconde la lista de resultados al hacer clic fuera
      }

      // Si el clic NO está dentro del contenedor del perfil, cerramos su menú
      if (perfilRef.current && !perfilRef.current.contains(evento.target)) {
        setMenuPerfilAbierto(false);
      }
    };

    // Añadimos el evento al documento
    document.addEventListener('mousedown', gestionarClicFuera);

    // Limpiamos el evento al destruir el componente para evitar fallos de memoria
    return () => {
      document.removeEventListener('mousedown', gestionarClicFuera);
    };
  }, []);



// ESTADOS PARA EL MENÚ Y EL BUSCADOR Y FILTROS
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  const [menuFiltrosAbierto, setMenuFiltrosAbierto] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState([]);

  const categoriasDisponibles = ["Sin huevo", "Sin leche", "Sin azúcar", "Sin harinas", "Sin frutos secos", "Sin gluten"];

  // LÓGICA DEL BUSCADOR Y FILTROS
  const manejarFiltroCategoria = (cat) => {
    if (filtrosSeleccionados.includes(cat)) {
      setFiltrosSeleccionados(filtrosSeleccionados.filter(c => c !== cat));
    } else {
      setFiltrosSeleccionados([...filtrosSeleccionados, cat]);
    }
  };

  const recetasFiltradas = recetas.filter(receta => {
    const coincideTexto = receta.titulo.toLowerCase().includes(textoBusqueda.toLowerCase());
    const coincideCategoria = filtrosSeleccionados.length === 0 || filtrosSeleccionados.every(cat => receta.categorias?.includes(cat));
    return coincideTexto && coincideCategoria;
  });


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
          
          {/* IZQUIERDA: Logo */}
          <Link to="/" className="logo-container">
            <img src={logoPng} alt="Logo Redetas" className="logo-image" />
          </Link>
          
          {/* CENTRO-IZQUIERDA: Menú de navegación */}
          <nav className="nav-links">
            <Link to="/">Inicio</Link>
            <Link to="/#">Recetas</Link>
            <Link to="/#">Comunidad</Link>
          </nav>
          
          {/* DERECHA: Buscador, Botón y Perfil */}
          <div className="header-actions">
            
         {/* Contenedor relativo para el buscador, filtros y sugerencias */}
            <div ref={buscadorRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              
              {/* LUPA SVG */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                style={{ position: 'absolute', left: '20px', pointerEvents: 'none' }}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>

              {/* INPUT DEL BUSCADOR */}
              <input 
                type="text" 
                placeholder="Buscar recetas..." 
                className="search-bar"
                value={textoBusqueda}
                onChange={(e) => {
                  setTextoBusqueda(e.target.value);
                  setMostrarSugerencias(true); /* 🟢 NUEVO: Al escribir, abrimos la lista */
                }}
                onFocus={() => setMostrarSugerencias(true)} /* 🟢 NUEVO: Al hacer clic en la barra, abrimos la lista */
                style={{ paddingLeft: '50px', paddingRight: '120px' }} 
              />

              {/* BOTÓN X PARA BORRAR */}
              {textoBusqueda.length > 0 && (
                <button 
                  onClick={() => {
                    setTextoBusqueda('');
                    setMostrarSugerencias(false); /* 🟢 NUEVO: Al borrar con la X, cerramos la lista */
                  }}
                  style={{ position: 'absolute', right: '95px', background: 'none', border: 'none', fontSize: '18px', color: '#888', cursor: 'pointer', padding: '5px' }}
                  title="Borrar búsqueda"
                >
                  ✕
                </button>
              )}

              {/* BOTÓN FILTROS */}
              <button 
                onClick={() => setMenuFiltrosAbierto(!menuFiltrosAbierto)}
                style={{ position: 'absolute', right: '15px', background: 'none', border: 'none', fontWeight: 'bold', color: 'var(--naranja-fuerte)', cursor: 'pointer', fontSize: '16px' }}
              >
                Filtros ▾
              </button>

              {/* Menú Desplegable de Categorías */}
              {menuFiltrosAbierto && (
                <div style={{ position: 'absolute', top: '65px', right: '0', background: 'white', border: '1px solid #E6DED7', borderRadius: '15px', padding: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 100, width: '380px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <span style={{ fontSize: '16px', color: '#888', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Filtro por categorías:</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {categoriasDisponibles.map(cat => (
                      <label key={cat} style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--gris-texto)' }}>
                        <input type="checkbox" checked={filtrosSeleccionados.includes(cat)} onChange={() => manejarFiltroCategoria(cat)} style={{ transform: 'scale(1.3)', cursor: 'pointer' }} /> {cat}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* CAJA DE AUTOCOMPLETADO */}
              {/* 🟢 NUEVO: Ahora solo aparece si mostrarSugerencias es 'true' */}
              {textoBusqueda.length > 0 && mostrarSugerencias && (
                <div style={{ position: 'absolute', top: '65px', left: '0', backgroundColor: 'white', border: '1px solid #E6DED7', borderRadius: '15px', width: '100%', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 99, overflow: 'hidden' }}>
                  {recetasFiltradas.length > 0 ? (
                    recetasFiltradas.slice(0, 5).map(receta => (
                      <div 
                        key={receta._id} 
                        onClick={() => {
                          setTextoBusqueda(receta.titulo);
                          setMostrarSugerencias(false); /* 🟢 NUEVO: Al hacer clic en un resultado, se cierra la lista */
                        }} 
                        style={{ padding: '12px 25px', cursor: 'pointer', borderBottom: '1px solid #eee', color: 'var(--gris-texto)', fontSize: '16px', display: 'flex', alignItems: 'center' }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor='#fdf8f5'} 
                        onMouseOut={e => e.currentTarget.style.backgroundColor='transparent'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--naranja-fuerte)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <span style={{ fontWeight: 'bold' }}>{receta.titulo}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '15px 25px', color: '#888', fontStyle: 'italic', fontSize: '16px' }}>
                      No se encontraron recetas con ese nombre...
                    </div>
                  )}
                </div>
              )}

            </div>




            {/* BOTÓN DE PUBLICACIÓN */}
            <Link to="/nueva-receta" className="publish-button">
              Publicar Receta
            </Link>

            {/* Círculo de Perfil o Login */}
            {usuarioLogueado ? (
              <div ref={perfilRef} style={{ position: 'relative', marginLeft: '10px' }}>
                <div 
                  onClick={() => setMenuPerfilAbierto(!menuPerfilAbierto)} 
                  style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--naranja-fuerte)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                  title="Opciones de cuenta"
                >
                  {usuarioLogueado.username.charAt(0).toUpperCase()}
                </div>

                {/* Menú Desplegable del Perfil */}
                {menuPerfilAbierto && (
                  <div style={{ position: 'absolute', top: '70px', right: '0', backgroundColor: 'white', border: '1px solid #E6DED7', borderRadius: '15px', padding: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 100, width: '200px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ padding: '10px', borderBottom: '1px solid #eee', marginBottom: '5px' }}>
                      <span style={{ fontSize: '12px', color: '#888' }}>Conectado como</span>
                      <br/><strong style={{ color: 'var(--gris-texto)' }}>{usuarioLogueado.username}</strong>
                    </div>
                    
                    <Link to={`/perfil/${usuarioLogueado._id}`} style={{ textDecoration: 'none', color: 'var(--gris-texto)', padding: '8px 10px', borderRadius: '8px', display: 'block' }} onMouseOver={e => e.target.style.backgroundColor='#f9f9f9'} onMouseOut={e => e.target.style.backgroundColor='transparent'}>👤 Ver tu perfil</Link>
                    <Link to="/configuracion" style={{ textDecoration: 'none', color: 'var(--gris-texto)', padding: '8px 10px', borderRadius: '8px', display: 'block' }} onMouseOver={e => e.target.style.backgroundColor='#f9f9f9'} onMouseOut={e => e.target.style.backgroundColor='transparent'}>⚙️ Tu configuración</Link>
                    
                    <button onClick={cerrarSesion} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '5px', color: '#D93025', cursor: 'pointer', paddingLeft: '10px', fontWeight: 'bold' }}>
                      🚪 Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/acceso" style={{ fontWeight: 'bold', color: 'var(--naranja-fuerte)', fontSize: '20px', textDecoration: 'none', marginLeft: '15px' }}>
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <h1 className="main-title">Últimas Recetas</h1>
        
        <div className="recetas-grid">
          
          {recetasFiltradas.map((receta) => (
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
                  {Array.isArray(receta.yummys) ? receta.yummys.length : 0} 😋                  </div>
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