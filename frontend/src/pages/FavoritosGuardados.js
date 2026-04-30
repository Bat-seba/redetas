// *********************************************************************************************************************
//  RUTA: frontend/src/pages/FavoritosGuardados.js
// 
// 🔹 Este componente gestiona la vista del recetario personal del usuario.
// 🔹 Renderiza un listado en formato tabla de las recetas guardadas y permite su filtrado o eliminación rápida.
// *********************************************************************************************************************

/**
 * @fileoverview Vista de la colección de recetas favoritas del usuario.
 * Implementa recuperación de datos poblados (populate), filtrado en el cliente y actualización optimista de la interfaz.
 * @author Bat-seba Rodríguez Moreno
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Swal from 'sweetalert2'; 

import '../App.css';
import '../components/Inicio.css';

/**
 * Componente funcional FavoritosGuardados.
 * 
 * @returns {JSX.Element|null} Interfaz del recetario personal o null si la validación de sesión falla.
 */
function FavoritosGuardados() {
    const navigate = useNavigate();
    
    // Recuperación de los datos de la sesión actual
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioRedetas'));
    const idUsuario = usuarioLogueado ? (usuarioLogueado._id || usuarioLogueado.id) : null;
  
    // Estado para almacenar el perfil completo incluyendo la colección poblada de recetas guardadas
    const [usuarioData, setUsuarioData] = useState(null); 
    
    // Estado para el control del campo de entrada del buscador interno
    const [textoBusquedaLocal, setTextoBusquedaLocal] = useState(''); 

    /**
     * Efecto de inicialización.
     * Protege la ruta verificando la sesión y ejecuta la petición asíncrona para obtener los favoritos.
     */
    useEffect(() => {
        if (!usuarioLogueado) {
            navigate('/acceso');
            return;
        }

        const cargarFavoritos = async () => {
            try {
                // Petición de lectura; el servidor debe resolver las referencias (populate) de 'recetasGuardadas'
                const res = await axios.get(`http://localhost:3000/api/v1/usuarios/${idUsuario}`);
                setUsuarioData(res.data);
            } catch (err) {
                console.error("Error en la carga de la colección de favoritos", err);
            }
        };

        cargarFavoritos();
    }, [idUsuario, navigate, usuarioLogueado]);

    /**
     * Elimina una receta específica de la colección de favoritos.
     * Ejecuta una petición PUT a la API y actualiza el estado local de forma optimista para evitar recargas.
     * 
     * @param {string} recetaId - Identificador único de la receta a desenlazar.
     */
    const quitarDeFavoritos = async (recetaId) => {
        Swal.fire({
            title: '¿Quitar de favoritos?',
            text: "Esta receta dejará de aparecer en tu recetario personal.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#D35400',
            cancelButtonColor: '#888',
            confirmButtonText: 'Sí, quitar',
            cancelButtonText: 'Mantener'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:3000/api/v1/usuarios/${idUsuario}/guardar`, {
                        recetaId: recetaId
                    });
          
                    // Actualización del estado local mediante filtrado para reflejar la acción inmediatamente
                    setUsuarioData({
                        ...usuarioData,
                        recetasGuardadas: usuarioData.recetasGuardadas.filter(r => r._id !== recetaId)
                    });

                    Swal.fire({
                        title: 'Eliminada',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } catch (error) {
                    console.error("Error de red al intentar retirar la receta de favoritos");
                }
            }
        });
    };

    // Procesamiento derivado: filtrado dinámico del array de favoritos según la entrada de texto
    const favoritosFiltrados = usuarioData?.recetasGuardadas?.filter(receta => 
        receta.titulo.toLowerCase().includes(textoBusquedaLocal.toLowerCase())
    ) || [];

    // Previene el renderizado del árbol si el ciclo de vida de redirección está en curso
    if (!usuarioLogueado) return null;

    return (
        <main className="main-content">
            
            {/* Navegación de retorno */}
            <div style={{ marginBottom: '30px' }}>
                <Link to="/mi-cuenta" style={{ textDecoration: 'none', color: '#888', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' }}>
                    <span style={{ fontSize: '28px', lineHeight: '1' }}>←</span> Volver a Mi Cuenta
                </Link>
            </div>

            {/* Cabecera de contexto del perfil de usuario */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', padding: '40px', backgroundColor: 'white', borderRadius: '20px', marginBottom: '40px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
                <div style={{ flexShrink: 0 }}>
                    <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: 'var(--naranja-fuerte)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '60px', fontWeight: 'bold', overflow: 'hidden' }}>
                        {usuarioData?.foto_perfil_url ? (
                            <img src={`http://localhost:3000/uploads/${usuarioData.foto_perfil_url}`} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            usuarioLogueado.username.charAt(0).toUpperCase()
                        )}
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '32px', color: 'var(--gris-texto)', margin: '0' }}>Mis Favoritos ⭐</h1>
                    <p style={{ color: 'var(--naranja-fuerte)', fontWeight: 'bold', fontSize: '18px', marginTop: '5px' }}>
                        @{usuarioLogueado.username.toLowerCase()} • {usuarioData?.recetasGuardadas?.length || 0} recetas guardadas
                    </p>
                    <p style={{ color: '#666', lineHeight: '1.6', fontSize: '16px', marginTop: '15px' }}>
                        Aquí puedes consultar rápidamente todas aquellas recetas que te han encantado y decidiste guardar para cocinar más tarde.
                    </p>
                </div>
            </div>

            {/* Sistema de filtrado local mediante input controlado */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fdf8f5', padding: '20px', borderRadius: '15px' }}>
                <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '15px', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input 
                        type="text" 
                        placeholder="Buscar entre mis recetas favoritas..." 
                        style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '10px', fontSize: '16px', border: '1px solid #ccc', outline: 'none' }} 
                        value={textoBusquedaLocal} 
                        onChange={(e) => setTextoBusquedaLocal(e.target.value)} 
                    />
                </div>
            </div>

            {/* Renderizado tabular de la información extraída */}
            <div style={{ backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee', textAlign: 'left' }}>
                            <th style={{ padding: '20px', color: '#666' }}>RECETA</th>
                            <th style={{ padding: '20px', color: '#666', textAlign: 'center' }}>CHEF / AUTOR</th>
                            <th style={{ padding: '20px', color: '#666', textAlign: 'center' }}>YUMMYS</th>
                            <th style={{ padding: '20px', color: '#666', textAlign: 'center' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {favoritosFiltrados.map(receta => (
                            <tr key={receta._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <Link to={`/receta/${receta._id}`}>
                                        <img 
                                            src={`http://localhost:3000/uploads/${receta.imagen}`} 
                                            alt={receta.titulo} 
                                            style={{ width: '100px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} 
                                        />
                                    </Link>
                                    <Link 
                                        to={`/receta/${receta._id}`} 
                                        style={{ textDecoration: 'none', color: 'var(--gris-texto)', fontWeight: 'bold', fontSize: '18px' }}
                                    >
                                        {receta.titulo.toUpperCase()}
                                    </Link>
                                </td>
                                
                                <td style={{ textAlign: 'center', color: '#888', fontWeight: 'bold' }}>
                                    {receta.nombreAutor}
                                </td>
                                
                                <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--naranja-fuerte)' }}>
                                    {receta.yummys?.length || 0} 😋
                                </td>
                                
                                <td style={{ textAlign: 'center' }}>
                                    <Link 
                                        to={`/receta/${receta._id}`} 
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', marginRight: '15px', textDecoration: 'none' }} 
                                        title="Ver Receta"
                                    >
                                        👁️
                                    </Link>
                                    <button 
                                        onClick={() => quitarDeFavoritos(receta._id)} 
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }} 
                                        title="Quitar de Favoritos"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Feedback visual para consultas sin resultados */}
                {favoritosFiltrados.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#888', fontSize: '18px' }}>
                        No hay recetas guardadas que coincidan con la búsqueda.
                    </div>
                )}
            </div>
        </main>
    );
}

export default FavoritosGuardados;