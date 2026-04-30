// *********************************************************************************************************************
//  RUTA: frontend/src/pages/PerfilPublico.js
// 
// 🔹 Este componente renderiza el perfil público de un usuario y muestra su catálogo personal de recetas publicadas.
// *********************************************************************************************************************

/**
 * @fileoverview Vista del Perfil Público de Usuario.
 * Permite la visualización de la identidad de otros usuarios y de su colección de recetas con filtrado local.
 * @author Bat-seba Rodríguez Moreno
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

/**
 * Componente funcional PerfilPublico.
 * 
 * @returns {JSX.Element} Vista pública de la biografía y recetario del usuario especificado en la ruta.
 */
function PerfilPublico() {
    // Extracción del parámetro dinámico 'id' de la URL de React Router
    const { id } = useParams(); 
    
    // Estados principales
    const [usuario, setUsuario] = useState(null);
    const [recetasUsuario, setRecetasUsuario] = useState([]);
    
    // Estado de control para el buscador local del recetario
    const [busqueda, setBusqueda] = useState('');
    
    // Estado de flujo de carga de la página
    const [cargando, setCargando] = useState(true);

    /**
     * Efecto de inicialización.
     * Ejecuta peticiones asíncronas para obtener la biografía del usuario y su repositorio de recetas.
     */
    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                // Petición para resolver los datos de identidad pública del usuario
                const resUsuario = await axios.get(`http://localhost:3000/api/v1/usuarios/${id}`);
                setUsuario(resUsuario.data);

                // Obtención del catálogo global y filtrado algorítmico en cliente
                // (Se contempla la compatibilidad con objetos poblados y referencias simples en 'autor')
                const resRecetas = await axios.get('http://localhost:3000/api/v1/recetas');
                const recetasFiltradas = resRecetas.data.filter(
                    (receta) => receta.autor === id || (receta.autor && receta.autor._id === id)
                );
                
                setRecetasUsuario(recetasFiltradas);
                setCargando(false);
            } catch (error) {
                console.error("Error de red en la obtención del perfil:", error);
                Swal.fire('Error', 'No se ha podido cargar el perfil de este usuario.', 'error');
                setCargando(false);
            }
        };

        obtenerDatos();
    }, [id]);

    /**
     * Operación derivada: Filtrado reactivo del array de recetas del autor 
     * basado en la coincidencia parcial de la cadena introducida en el buscador.
     */
    const recetasMostradas = recetasUsuario.filter(receta => 
        receta.titulo.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Renderizado temprano para estados transitorios (carga/error)
    if (cargando) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Cargando perfil... ⏳</h2>;
    if (!usuario) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Usuario no encontrado ❌</h2>;

    return (
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
            
            {/* SECCIÓN: NAVEGACIÓN */}
            <div style={{ marginBottom: '30px' }}>
                  <Link to="/" style={{ textDecoration: 'none', color: '#888', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' }}>
                    <span style={{ fontSize: '28px', lineHeight: '1' }}>←</span> Volver a Inicio
                  </Link>
            </div>

            {/* SECCIÓN: CABECERA DEL PERFIL PÚBLICO */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', backgroundColor: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '40px', flexWrap: 'wrap' }}>
                
                {/* Renderizado de Avatar Condicional */}
                <img 
                    src={usuario.foto_perfil_url ? `http://localhost:3000/uploads/${usuario.foto_perfil_url}` : 'https://via.placeholder.com/150'} 
                    alt={`Perfil de ${usuario.username}`} 
                    style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #D35400' }}
                />
                
                {/* Metadatos de Identidad */}
                <div>
                    <h1 style={{ color: '#D35400', fontSize: '40px', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
                        {usuario.username}
                    </h1>
                    <p style={{ fontSize: '20px', color: '#666', maxWidth: '700px', lineHeight: '1.5' }}>
                        {usuario.bio ? usuario.bio : 'Este usuario aún no ha escrito una biografía, pero seguro que cocina de maravilla. 👨‍🍳'}
                    </p>
                </div>
            </div>

            {/* SECCIÓN: HERRAMIENTA DE FILTRADO LOCAL */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                    <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '24px' }}>
                        {/* Espacio reservado para iconografía (opcional) */}
                    </span>
                    <input
                        type="text"
                        placeholder={`Buscar en las recetas de ${usuario.username}...`}
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '18px 20px 18px 60px',
                            fontSize: '20px',
                            borderRadius: '50px',
                            border: '2px solid #D35400',
                            outline: 'none',
                            boxShadow: '0 6px 15px rgba(211, 84, 0, 0.1)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>
            </div>

            {/* SECCIÓN: GALERÍA DE PUBLICACIONES */}
            <h2 style={{ color: '#333', marginBottom: '25px', fontSize: '28px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                Recetario de {usuario.username} ({recetasMostradas.length})
            </h2>
            
            {/* Renderizado condicional basado en la existencia de elementos en la matriz filtrada */}
            {recetasMostradas.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                    {recetasMostradas.map(receta => (
                        <div key={receta._id} style={{ backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 6px 15px rgba(0,0,0,0.1)' }}>
                            <img 
                                src={receta.imagen ? `http://localhost:3000/uploads/${receta.imagen}` : 'https://via.placeholder.com/300x200'} 
                                alt={receta.titulo} 
                                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                            />
                            <div style={{ padding: '25px' }}>
                                <h3 style={{ margin: '0 0 15px 0', color: '#D35400', fontSize: '22px' }}>{receta.titulo}</h3>
                                <Link to={`/receta/${receta._id}`} style={{ display: 'block', textAlign: 'center', backgroundColor: '#D35400', color: '#fff', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
                                    Ver Receta
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fdf8f5', borderRadius: '15px', border: '2px dashed #ccc' }}>
                    <p style={{ fontSize: '22px', color: '#888' }}>
                        {busqueda ? 'No hay ninguna receta que coincida con tu búsqueda. 😕' : 'Este usuario aún no ha publicado ninguna receta.'}
                    </p>
                </div>
            )}

        </div>
    );
}

export default PerfilPublico;