// *********************************************************************************************************************
//  RUTA: frontend/src/pages/MasPopulares.js
// 
// 🔹 Este componente renderiza el ranking de las recetas más populares basadas en la cantidad de interacciones (Yummys).
// *********************************************************************************************************************

/**
 * @fileoverview Vista del Salón de la Fama (Ranking Top 10).
 * Recupera el catálogo, aplica un algoritmo de ordenamiento en el cliente y renderiza dinámicamente las posiciones.
 * @author Bat-seba Rodríguez Moreno
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logoPng from '../components/logo.png';
import '../App.css';

/**
 * Componente funcional MasPopulares.
 * 
 * @returns {JSX.Element} Interfaz del ranking de recetas con navegación superior.
 */
function MasPopulares() {
    // Recuperación de la sesión actual
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioRedetas'));
    
    // Estados principales
    const [recetasTop, setRecetasTop] = useState([]);
    const [datosUsuarioHeader, setDatosUsuarioHeader] = useState(null);

    /**
     * Efecto de inicialización.
     * Restablece el scroll y ejecuta la carga, ordenamiento y truncamiento de los datos de recetas.
     */
    useEffect(() => {
        // Restablece la posición de desplazamiento al inicio de la página tras el montaje
        window.scrollTo(0, 0);

        const cargarDatos = async () => {
            try {
                // Petición de lectura para obtener el catálogo completo de recetas
                const res = await axios.get('http://localhost:3000/api/v1/recetas');
                
                // Algoritmo de ordenamiento descendente basado en la longitud del array de yummys
                const recetasOrdenadas = res.data.sort((a, b) => {
                    const yummysA = a.yummys ? a.yummys.length : 0;
                    const yummysB = b.yummys ? b.yummys.length : 0;
                    return yummysB - yummysA; 
                });

                // Extracción de los 10 primeros elementos para la visualización del ranking
                setRecetasTop(recetasOrdenadas.slice(0, 10));

                // Recuperación de la información de perfil para el renderizado del Header
                if (usuarioLogueado) {
                    const id = usuarioLogueado._id || usuarioLogueado.id;
                    const resUser = await axios.get(`http://localhost:3000/api/v1/usuarios/${id}`);
                    setDatosUsuarioHeader(resUser.data);
                }
            } catch (err) {
                console.error("Error en la obtención y procesamiento del ranking", err);
            }
        };
        cargarDatos();
    }, []);

    return (
        <div style={{ backgroundColor: '#fdfaf7', minHeight: '100vh' }}>
            
            {/* SECCIÓN: ENCABEZADO DE NAVEGACIÓN */}
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

            {/* SECCIÓN: CONTENIDO PRINCIPAL */}
            <main style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 style={{ fontSize: '42px', color: '#333', marginBottom: '10px' }}>🏆 Salón de la Fama</h1>
                    <p style={{ fontSize: '20px', color: '#666' }}>Aquí tienes colocadas las recetas con más yummys de toda la comunidad.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {recetasTop.map((receta, index) => {
                        // Determinación de estilos dinámicos (medallas y bordes) según el índice de iteración
                        let fondoPosicion = '#f0f0f0';
                        let medalla = `# ${index + 1}`;
                        let bordeTarjeta = '1px solid #eee';

                        if (index === 0) { medalla = '🥇 1º'; fondoPosicion = '#FFD700'; bordeTarjeta = '3px solid #FFD700'; } 
                        else if (index === 1) { medalla = '🥈 2º'; fondoPosicion = '#E0E0E0'; bordeTarjeta = '3px solid #C0C0C0'; } 
                        else if (index === 2) { medalla = '🥉 3º'; fondoPosicion = '#CD7F32'; bordeTarjeta = '3px solid #CD7F32'; } 

                        return (
                            <div key={receta._id} style={{ display: 'flex', backgroundColor: 'white', borderRadius: '15px', padding: '20px', alignItems: 'center', gap: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', border: bordeTarjeta, transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                
                                {/* Renderizado de la posición o medalla */}
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: fondoPosicion, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: index < 3 ? '24px' : '20px', fontWeight: 'bold', color: index < 3 ? 'white' : '#666', flexShrink: 0, textShadow: index < 3 ? '1px 1px 2px rgba(0,0,0,0.2)' : 'none' }}>
                                    {medalla}
                                </div>

                                {/* Renderizado de la miniatura de la receta */}
                                <div style={{ width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={`http://localhost:3000/uploads/${receta.imagen}`} alt={receta.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>

                                {/* Renderizado de la información principal de la receta */}
                                <div style={{ flexGrow: 1 }}>
                                    <Link to={`/receta/${receta._id}`} style={{ textDecoration: 'none', color: '#333' }}>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>{receta.titulo}</h3>
                                    </Link>
                                    <p style={{ margin: 0, color: '#888', fontSize: '16px' }}>Por <span style={{ fontWeight: 'bold', color: '#D35400' }}>{receta.nombreAutor}</span></p>
                                </div>

                                {/* Indicador cuantitativo de interacciones */}
                                <div style={{ textAlign: 'center', flexShrink: 0, padding: '0 20px' }}>
                                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#D35400' }}>
                                        {receta.yummys ? receta.yummys.length : 0}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#888' }}>😋 Yummys</div>
                                </div>

                                {/* Acción de navegación al detalle */}
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