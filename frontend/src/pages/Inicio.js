// *********************************************************************************************************************
//  RUTA: frontend/src/pages/Inicio.js
// 
// 🔹 Este componente representa la pantalla principal (Feed) de la aplicación.
// 🔹 Integra la visualización del catálogo de recetas, un buscador interactivo y el sistema de navegación global.
// *********************************************************************************************************************

/**
 * @fileoverview Vista principal y Feed de recetas.
 * Gestiona la carga del catálogo principal, filtrado dinámico en cliente y la interfaz de navegación superior (Header).
 * @author Bat-seba Rodríguez Moreno
 */

import React, { useState, useEffect, useRef } from 'react'; 
import { Link } from 'react-router-dom';
import axios from 'axios'; 

import logoPng from '../components/logo.png'; 
import '../App.css';
import '../components/Inicio.css'; 

import iconoSinAzucar from '../components/iconos/icono_sin_azucar.png';
import iconoSinFrutosSecos from '../components/iconos/icono_sin_frutos_secos.png';
import iconoSinGluten from '../components/iconos/icono_sin_gluten.png';
import iconoSinHarinas from '../components/iconos/icono_sin_harinas.png';
import iconoSinHuevo from '../components/iconos/icono_sin_huevo.png';
import iconoSinLeche from '../components/iconos/icono_sin_leche.png';

/**
 * Componente funcional Inicio.
 * 
 * @returns {JSX.Element} Interfaz del feed principal con navegación y tarjetas de recetas.
 */
function Inicio() {
    // Recuperación de la sesión actual
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioRedetas'));
    
    // Estados principales de datos
    const [recetas, setRecetas] = useState([]);
    const [datosUsuarioHeader, setDatosUsuarioHeader] = useState(null); 
    
    // Referencias para la gestión de eventos de clic fuera del elemento
    const buscadorRef = useRef(null);
    const perfilRef = useRef(null);
    
    // Estados de control de interfaz de usuario (UI)
    const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
    const [menuFiltrosAbierto, setMenuFiltrosAbierto] = useState(false);
    const [textoBusqueda, setTextoBusqueda] = useState('');
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [filtrosSeleccionados, setFiltrosSeleccionados] = useState([]);
    const [menuAbierto, setMenuAbierto] = useState(false); 

    // Definición constante de categorías para el filtrado
    const categoriasDisponibles = ["Sin huevo", "Sin leche", "Sin azúcar", "Sin harinas", "Sin frutos secos", "Sin gluten"];

    /**
     * Efecto secundario para el control de clics fuera de los menús desplegables.
     * Cierra el autocompletado y el menú de perfil si se interactúa con el resto del DOM.
     */
    useEffect(() => {
        const gestionarClicFuera = (evento) => {
            if (buscadorRef.current && !buscadorRef.current.contains(evento.target)) {
                setMenuFiltrosAbierto(false);
                setMostrarSugerencias(false); 
            }
            if (perfilRef.current && !perfilRef.current.contains(evento.target)) {
                setMenuPerfilAbierto(false);
            }
        };
        document.addEventListener('mousedown', gestionarClicFuera);
        return () => { document.removeEventListener('mousedown', gestionarClicFuera); };
    }, []);

    /**
     * Efecto secundario de inicialización.
     * Ejecuta peticiones asíncronas para obtener el catálogo de recetas y los datos del usuario para el Header.
     */
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Obtención de la colección completa de recetas
                const resRecetas = await axios.get('http://localhost:3000/api/v1/recetas');
                setRecetas(resRecetas.data);

                // Obtención del perfil actualizado para renderizar la foto en el Header
                if (usuarioLogueado) {
                    const id = usuarioLogueado._id || usuarioLogueado.id;
                    const resUser = await axios.get(`http://localhost:3000/api/v1/usuarios/${id}`);
                    setDatosUsuarioHeader(resUser.data);
                }
            } catch (err) {
                console.error("Error cargando datos de inicio", err);
            }
        };
        cargarDatos();
    }, []);

    /**
     * Alterna la inclusión de una categoría en el array de filtros activos.
     * 
     * @param {string} cat - Nombre de la categoría seleccionada o deseleccionada.
     */
    const manejarFiltroCategoria = (cat) => {
        if (filtrosSeleccionados.includes(cat)) {
            setFiltrosSeleccionados(filtrosSeleccionados.filter(c => c !== cat));
        } else {
            setFiltrosSeleccionados([...filtrosSeleccionados, cat]);
        }
    };

    /**
     * Computa dinámicamente el listado de recetas basándose en la búsqueda por texto y los filtros activos.
     * Ambas condiciones deben cumplirse simultáneamente (AND).
     */
    const recetasFiltradas = recetas.filter(receta => {
        const coincideTexto = receta.titulo.toLowerCase().includes(textoBusqueda.toLowerCase());
        const coincideCategoria = filtrosSeleccionados.length === 0 || filtrosSeleccionados.every(cat => receta.categorias?.includes(cat));
        return coincideTexto && coincideCategoria;
    });

    // Diccionario de mapeo estático para asociar cadenas de texto con activos gráficos
    const mapaIconos = {
        "Sin gluten": iconoSinGluten,
        "Sin huevo": iconoSinHuevo,
        "Sin leche": iconoSinLeche,
        "Sin azúcar": iconoSinAzucar,
        "Sin harinas": iconoSinHarinas,
        "Sin frutos secos": iconoSinFrutosSecos
    };

    /**
     * Destruye la sesión de usuario en el cliente y fuerza una recarga para limpiar el estado de la aplicación.
     */
    const cerrarSesion = () => {
        localStorage.removeItem('usuarioRedetas'); 
        window.location.reload(); 
    };

    /**
     * Utilidad de formato de texto: Trunca una cadena larga conservando únicamente las dos primeras oraciones.
     * 
     * @param {string} texto - Cadena original a recortar.
     * @returns {string} Cadena truncada con elipsis si excede el límite.
     */
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
                    
                    {/* Botonera de visualizacion condicional (Responsive - Mobile) */}
                    <button 
                        className="burger-button" 
                        onClick={() => setMenuAbierto(!menuAbierto)}
                    >
                        {menuAbierto ? '✕' : '☰'} 
                    </button>

                    <Link to="/" className="logo-container">
                        <img src={logoPng} alt="Logo Redetas" className="logo-image" />
                    </Link>
                    
                    {/* Enlaces de navegacion con vinculacion al estado responsivo */}
                    <nav className={`nav-links ${menuAbierto ? 'open' : ''}`}>
                        <Link to="/" onClick={() => setMenuAbierto(false)}>Inicio</Link>  
                        <Link to="/mas-populares" onClick={() => setMenuAbierto(false)}>Más populares</Link> 
                        <Link to="/sobre-redetas" onClick={() => setMenuAbierto(false)}>Sobre Redetas</Link>
                    </nav>
                    
                    <div className="header-actions">
                        <div ref={buscadorRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '20px', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>

                            <input 
                                type="text" 
                                placeholder="Buscar recetas..." 
                                className="search-bar"
                                value={textoBusqueda}
                                onChange={(e) => { setTextoBusqueda(e.target.value); setMostrarSugerencias(true); }}
                                onFocus={() => setMostrarSugerencias(true)}
                                style={{ paddingLeft: '50px', paddingRight: '120px' }} 
                            />

                            {textoBusqueda.length > 0 && (
                                <button onClick={() => { setTextoBusqueda(''); setMostrarSugerencias(false); }} style={{ position: 'absolute', right: '95px', background: 'none', border: 'none', fontSize: '18px', color: '#888', cursor: 'pointer', padding: '5px' }}>✕</button>
                            )}

                            <button onClick={() => setMenuFiltrosAbierto(!menuFiltrosAbierto)} style={{ position: 'absolute', right: '15px', background: 'none', border: 'none', fontWeight: 'bold', color: 'var(--naranja-fuerte)', cursor: 'pointer', fontSize: '16px' }}>Filtros ▾</button>

                            {/* Renderizado condicional del panel de filtros */}
                            {menuFiltrosAbierto && (
                                <div style={{ position: 'absolute', top: '65px', right: '0', background: 'white', border: '1px solid #E6DED7', borderRadius: '15px', padding: '25px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', zIndex: 100, width: '420px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <span style={{ fontSize: '18px', color: '#888', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>Filtro por categorías:</span>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        {categoriasDisponibles.map(cat => (
                                            <label key={cat} style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: 'var(--gris-texto)', userSelect: 'none' }}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={filtrosSeleccionados.includes(cat)} 
                                                    onChange={() => manejarFiltroCategoria(cat)} 
                                                    style={{ transform: 'scale(1.5)', cursor: 'pointer', accentColor: '#D35400' }} 
                                                /> 
                                                {cat}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Renderizado condicional de la lista de sugerencias predictivas */}
                            {textoBusqueda.length > 0 && mostrarSugerencias && (
                                <div style={{ position: 'absolute', top: '65px', left: '0', backgroundColor: 'white', border: '1px solid #E6DED7', borderRadius: '15px', width: '100%', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 99, overflow: 'hidden' }}>
                                    {recetasFiltradas.length > 0 ? (
                                        recetasFiltradas.slice(0, 5).map(receta => (
                                            <div key={receta._id} onClick={() => { setTextoBusqueda(receta.titulo); setMostrarSugerencias(false); }} style={{ padding: '12px 25px', cursor: 'pointer', borderBottom: '1px solid #eee', color: 'var(--gris-texto)', fontSize: '16px', display: 'flex', alignItems: 'center' }} onMouseOver={e => e.currentTarget.style.backgroundColor='#fdf8f5'} onMouseOut={e => e.currentTarget.style.backgroundColor='transparent'}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--naranja-fuerte)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                                <span style={{ fontWeight: 'bold' }}>{receta.titulo}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: '15px 25px', color: '#888', fontStyle: 'italic', fontSize: '16px' }}>No se encontraron recetas...</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <Link to="/nueva-receta" className="publish-button">Publicar Receta</Link>

                        {usuarioLogueado ? (
                            <div ref={perfilRef} style={{ position: 'relative', marginLeft: '10px' }}>
                                {/* Modulo visual de identidad en Header */}
                                <div 
                                    onClick={() => setMenuPerfilAbierto(!menuPerfilAbierto)} 
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--naranja-fuerte)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', overflow: 'hidden' }}
                                >
                                    {datosUsuarioHeader?.foto_perfil_url ? (
                                        <img src={`http://localhost:3000/uploads/${datosUsuarioHeader.foto_perfil_url}`} alt="Mí perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        usuarioLogueado.username.charAt(0).toUpperCase()
                                    )}
                                </div>

                                {menuPerfilAbierto && (
                                    <div style={{ position: 'absolute', top: '70px', right: '0', backgroundColor: 'white', border: '1px solid #E6DED7', borderRadius: '15px', padding: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 100, width: '200px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <div style={{ padding: '10px', borderBottom: '1px solid #eee', marginBottom: '5px' }}>
                                            <span style={{ fontSize: '12px', color: '#888' }}>Conectado como</span>
                                            <br/><strong style={{ color: '#333' }}>{usuarioLogueado.username}</strong>
                                        </div>

                                        <Link to="/mi-cuenta" style={{ textDecoration: 'none', color: '#333', padding: '8px 10px', borderRadius: '8px', display: 'block' }}>👤 Mi Cuenta </Link>
                                        <Link to="/configuracion" style={{ textDecoration: 'none', color: '#333', padding: '8px 10px', borderRadius: '8px', display: 'block' }}>⚙️ Tu configuración</Link>

                                        {/* ENLACE CONDICIONAL DE ADMINISTRADOR */}
                                        {usuarioLogueado.rol === 'admin' && (
                                            <Link 
                                                to="/admin" 
                                                style={{ 
                                                    textDecoration: 'none', 
                                                    color: '#D35400', 
                                                    padding: '8px 10px', 
                                                    borderRadius: '8px', 
                                                    display: 'block', 
                                                    fontWeight: 'bold', 
                                                    borderTop: '1px solid #eee', 
                                                    marginTop: '5px' 
                                                }}
                                            >
                                                🛡️ Panel de Control
                                            </Link>
                                        )}
                                        
                                        <button onClick={cerrarSesion} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '5px', color: '#D93025', cursor: 'pointer', paddingLeft: '10px', fontWeight: 'bold' }}>🚪 Cerrar sesión</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/acceso" style={{ fontWeight: 'bold', color: 'var(--naranja-fuerte)', fontSize: '20px', textDecoration: 'none', marginLeft: '15px' }}>Entrar</Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="main-content">
                <h1 className="main-title">Últimas Recetas</h1>
                
                <div className="recetas-grid">
                    {recetasFiltradas.map((receta) => (
                        /* Flex column base para expandir el alto relativo y alinear el contenido remanente */
                        <div key={receta._id} className="receta-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div className="card-image-container">
                                <Link to={`/receta/${receta._id}`}>
                                    <img src={`http://localhost:3000/uploads/${receta.imagen}`} alt={receta.titulo} className="card-image" />
                                </Link>
                            </div>

                            {/* Aplicacion de flexGrow para rellenar la altura de la tarjeta de forma homogenea */}
                            <div className="card-content" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <Link to={`/receta/${receta._id}`} style={{ textDecoration: 'none' }}>
                                    <h3 className="card-title">{receta.titulo.toUpperCase()}</h3>
                                </Link>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                                    
                                    {/* Componente visual del autor de la receta */}
                                    <Link to={`/usuario/${receta.autor?._id || receta.autor}`} style={{ textDecoration: 'none', color: '#D35400', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        
                                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#D35400', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px', overflow: 'hidden' }}>
                                            {receta.autor?.foto_perfil_url ? (
                                                <img src={`http://localhost:3000/uploads/${receta.autor.foto_perfil_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                receta.nombreAutor ? receta.nombreAutor.charAt(0).toUpperCase() : 'U'
                                            )}
                                        </div>

                                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{receta.nombreAutor}</span>
                                    </Link>

                                    <div style={{ color: '#D35400', fontWeight: 'bold', fontSize: '18px' }}>
                                        {Array.isArray(receta.yummys) ? receta.yummys.length : 0} 😋
                                    </div>
                                </div>

                                <div className="apto-iconos">
                                    {receta.categorias && receta.categorias.map(cat => (
                                        <div key={cat} className="contenedor-icono-magico">
                                            <img src={mapaIconos[cat]} alt={cat} className="icono-categoria-img" />
                                            <span className="texto-flotante">{cat}</span>
                                        </div>
                                    ))}
                                </div>

                                <p className="card-description">{recortarInstrucciones(receta.instrucciones)}</p>

                                {/* Margen automatico (mt: auto) para forzar la colocacion del boton en la base interior */}
                                <Link to={`/receta/${receta._id}`} style={{ textDecoration: 'none', marginTop: 'auto' }}>
                                    <button className="btn-view-recipe" style={{ width: '100%' }}>VER RECETA</button>
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