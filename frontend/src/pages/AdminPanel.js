// *********************************************************************************************************************
//  RUTA: frontend/src/pages/AdminPanel.js
// 
// 🔹 Este componente representa el panel de control central para los administradores del sistema.
// 🔹 Permite la gestión global de la comunidad (usuarios) y la moderación de contenidos (recetas).
// *********************************************************************************************************************

/**
 * @fileoverview Vista de administración de Redetas.
 * Implementa controles de acceso por rol, visualización de estadísticas y operaciones de borrado administrativo.
 * @author Bat-seba Rodríguez Moreno
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Componente funcional AdminPanel.
 * Gestiona el catálogo completo de usuarios y recetas con facultades de moderación.
 * 
 * @returns {JSX.Element} Interfaz de administración con navegación por pestañas.
 */
function AdminPanel() {
    // Estados para el almacenamiento de los listados recuperados de la API
    const [usuarios, setUsuarios] = useState([]);
    const [recetas, setRecetas] = useState([]);
    
    // Control de navegación interna (pestañas)
    const [pestaña, setPestaña] = useState('usuarios'); 
    
    const navigate = useNavigate();
    
    // Recuperación de la sesión actual para validación de privilegios
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioRedetas'));

    /**
     * Efecto de inicialización: valida el rol de administrador y carga los datos.
     * Si el usuario no tiene permisos suficientes, se redirige automáticamente al Inicio.
     */
    useEffect(() => {
        if (!usuarioLogueado || usuarioLogueado.rol !== 'admin') {
            Swal.fire('Acceso denegado', 'No tienes permisos de administrador', 'error');
            navigate('/');
        } else {
            cargarDatos();
        }
    }, []);

    /**
     * Realiza peticiones asíncronas concurrentes para obtener la información global.
     */
    const cargarDatos = async () => {
        try {
            const resU = await axios.get('http://localhost:3000/api/v1/usuarios/admin/usuarios');
            const resR = await axios.get('http://localhost:3000/api/v1/recetas/admin/todas');
            setUsuarios(resU.data);
            setRecetas(resR.data);
        } catch (error) {
            console.error("Error cargando datos de admin", error);
        }
    };

    /**
     * Ejecuta la lógica de eliminación para cualquier entidad (Usuario o Receta).
     * Incluye una confirmación visual de seguridad mediante SweetAlert2.
     * 
     * @param {string} tipo - Tipo de entidad a eliminar ('usuario' | 'receta').
     * @param {string} id - Identificador único del documento en MongoDB.
     */
    const eliminarItem = (tipo, id) => {
        Swal.fire({
            title: `¿Estás segura?`,
            text: `Vas a eliminar este ${tipo} permanentemente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'SÍ, ELIMINAR',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Dinamización de la URL según el tipo de recurso
                    const url = tipo === 'usuario' ? `usuarios/${id}` : `recetas/${id}`;
                    await axios.delete(`http://localhost:3000/api/v1/${url}`);
                    
                    Swal.fire('Eliminado', `El ${tipo} ha sido borrado correctamente.`, 'success');
                    cargarDatos(); // Sincronización del estado tras la eliminación
                } catch (error) {
                    Swal.fire('Error', 'No se pudo eliminar.', 'error');
                }
            }
        });
    };

    return (
        <div style={{ padding: '40px', maxWidth: '900px', margin: '40px auto', backgroundColor: '#f9f9f9', borderRadius: '15px' }}>
            {/* Enlace de navegación para retorno seguro */}
            <div style={{ marginBottom: '30px' }}>
              <Link to="/" style={{ textDecoration: 'none', color: '#888', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' }}>
                <span style={{ fontSize: '28px' }}>←</span> Volver a Inicio
              </Link>
            </div>

            <h1 style={{ color: '#D35400', textAlign: 'center' }}>PANEL DE ADMINISTRACIÓN</h1>
            <p style={{ textAlign: 'center', color: '#666' }}>Gestión de comunidad y contenidos de Redetas</p>
            
            {/* Sistema de navegación por pestañas */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '30px 0' }}>
                <button 
                    onClick={() => setPestaña('usuarios')} 
                    style={pestaña === 'usuarios' ? estiloBtnActivo : estiloBtnInactivo}
                >
                    Usuarios ({usuarios.length})
                </button>
                <button 
                    onClick={() => setPestaña('recetas')} 
                    style={pestaña === 'recetas' ? estiloBtnActivo : estiloBtnInactivo}
                >
                    Recetas ({recetas.length})
                </button>
            </div>

            {/* Contenedor dinámico de contenidos según pestaña activa */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                {pestaña === 'usuarios' ? (
                    <div>
                        <h3 style={{ borderBottom: '2px solid #D35400', paddingBottom: '10px' }}>Lista de Usuarios</h3>
                        {usuarios.map(u => (
                            <div key={u._id} style={estiloFila}>
                                <div>
                                    <strong>{u.username}</strong> <br />
                                    <small style={{ color: '#888' }}>{u.email}</small>
                                </div>
                                <button onClick={() => eliminarItem('usuario', u._id)} style={estiloBtnBorrar}>Eliminar</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <h3 style={{ borderBottom: '2px solid #D35400', paddingBottom: '10px' }}>Lista de Recetas</h3>
                        {recetas.map(r => (
                            <div key={r._id} style={estiloFila}>
                                <div>
                                    <strong>{r.titulo}</strong> <br />
                                    <small style={{ color: '#888' }}>Autor: {r.nombreAutor || r.autor?.username}</small>
                                </div>
                                <button onClick={() => eliminarItem('receta', r._id)} style={estiloBtnBorrar}>Borrar Receta</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ==========================================
// DEFINICIÓN DE ESTILOS (CSS-in-JS)
// ==========================================
const estiloBtnActivo = { 
    backgroundColor: '#D35400', 
    color: 'white', 
    padding: '12px 25px', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: 'bold' 
};

const estiloBtnInactivo = { 
    backgroundColor: '#e0e0e0', 
    color: '#666', 
    padding: '12px 25px', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer' 
};

const estiloFila = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '15px 0', 
    borderBottom: '1px solid #eee' 
};

const estiloBtnBorrar = { 
    backgroundColor: '#ffeded', 
    color: '#d33', 
    border: '1px solid #d33', 
    padding: '8px 15px', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontWeight: 'bold' 
};

export default AdminPanel;