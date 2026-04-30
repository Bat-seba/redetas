// *********************************************************************************************************************
//  RUTA: frontend/src/pages/Configuracion.js
// 
// 🔹 Este componente gestiona los ajustes de cuenta privados del usuario autenticado.
// 🔹 Incluye funcionalidades para la actualización de identidad, gestión de seguridad y baja del servicio.
// *********************************************************************************************************************

/**
 * @fileoverview Vista de configuración de usuario.
 * Proporciona interfaces para modificar el username, actualizar la contraseña con validación de hash y borrado de cuenta.
 * @author Bat-seba Rodríguez Moreno
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

/**
 * Componente funcional Configuracion.
 * Implementa la lógica de gestión de perfil con persistencia en LocalStorage y comunicación con la API.
 * 
 * @returns {JSX.Element} Interfaz de ajustes con secciones segmentadas.
 */
function Configuracion() {
    const navigate = useNavigate();
    
    // Recuperación de la sesión actual desde el almacenamiento local
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioRedetas'));

    // Estados para la gestión de campos de entrada (Inputs)
    const [nuevoNombre, setNuevoNombre] = useState(usuarioLogueado?.username || '');
    const [passActual, setPassActual] = useState('');
    const [passNueva, setPassNueva] = useState('');
    const [passConfirmar, setPassConfirmar] = useState('');

    // Normalización del ID de usuario para compatibilidad de esquemas
    const idUsuario = usuarioLogueado?._id || usuarioLogueado?.id;
    
    // Estados booleanos para el control de visibilidad de contraseñas (Toggle Show/Hide)
    const [verPassActual, setVerPassActual] = useState(false);
    const [verPassNueva, setVerPassNueva] = useState(false);
    const [verPassConfirmar, setVerPassConfirmar] = useState(false);

    /**
     * Procesa la actualización del nombre de usuario.
     * Sincroniza el cambio con la base de datos y actualiza la sesión local tras el éxito.
     * 
     * @param {React.FormEvent} e - Evento de envío del formulario.
     */
    const handleNombre = async (e) => {
        e.preventDefault();
        
        // Validación preventiva en cliente para evitar cadenas vacías
        if (!nuevoNombre.trim()) {
            return Swal.fire('Atención', 'El nombre no puede estar vacío', 'warning');
        }

        try {
            const res = await axios.put(`http://localhost:3000/api/v1/usuarios/${idUsuario}`, {
                username: nuevoNombre
            });
            
            // Actualización del LocalStorage con el nuevo objeto de usuario devuelto por el servidor
            localStorage.setItem('usuarioRedetas', JSON.stringify(res.data.usuario));
            
            Swal.fire({
                title: '¡Éxito!',
                text: 'Nombre de usuario actualizado correctamente',
                icon: 'success',
                confirmButtonColor: '#D35400',
                confirmButtonText: 'Entendido'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Solo recarga cuando el usuario pulsa el botón de la alerta
                    window.location.reload(); 
                }
            });
            
        } catch (error) {
            // Manejo de errores específicos (ej. 400 por duplicidad de nombre)
            const mensajeError = error.response?.data?.mensaje || 'No se pudo cambiar el nombre';
            Swal.fire('Error', mensajeError, 'error');
        }
    };

    /**
     * Gestiona el cambio de credenciales de acceso.
     * Requiere la validación de la contraseña actual antes de proceder con el hashing de la nueva.
     * 
     * @param {React.FormEvent} e - Evento de envío del formulario.
     */
    const handlePassword = async (e) => {
        e.preventDefault();
        
        // Validación de coincidencia de campos en cliente
        if (passNueva !== passConfirmar) {
            return Swal.fire('Atención', 'La nueva contraseña no coincide en ambos campos', 'warning');
        }

        try {
            await axios.put(`http://localhost:3000/api/v1/usuarios/${idUsuario}/password`, {
                passwordAnterior: passActual,
                passwordNueva: passNueva
            });
            
            Swal.fire('¡Hecho!', 'Contraseña actualizada correctamente', 'success');
            
            // Reseteo de campos de seguridad tras el éxito
            setPassActual(''); 
            setPassNueva(''); 
            setPassConfirmar('');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.mensaje || 'Error al cambiar contraseña', 'error');
        }
    };

    /**
     * Ejecuta el proceso de baja del usuario.
     * Incluye confirmación modal obligatoria y limpieza de tokens/sesión local tras el borrado.
     */
    const handleEliminarCuenta = () => {
        Swal.fire({
            title: '¿ESTÁS SEGURO?',
            text: "Esta acción es irreversible. Se borrarán todos tus datos de Redetas.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'SÍ, BORRAR TODO',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:3000/api/v1/usuarios/${idUsuario}`);
                    
                    // Limpieza total del rastro de sesión
                    localStorage.removeItem('usuarioRedetas');
                    
                    Swal.fire('Eliminado', 'Tu cuenta ha sido borrada.', 'success').then(() => {
                        window.location.href = "/";
                    });
                } catch (error) {
                    Swal.fire('Error', 'No pudimos eliminar la cuenta', 'error');
                }
            }
        });
    };

    // Renderizado de seguridad: previene el acceso a la interfaz si no existe sesión activa
    if (!usuarioLogueado) return <h2 style={{ textAlign: 'center' }}>Debes iniciar sesión</h2>;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
            <h1 style={{ color: '#D35400', marginBottom: '30px', textAlign: 'center' }}>⚙️ AJUSTES DE CUENTA</h1>

            <div style={{ display: 'grid', gap: '30px' }}>
                
                {/* SECCIÓN: ACTUALIZACIÓN DE IDENTIDAD */}
                <div style={estiloSeccion}>
                    <h3>Nombre de Usuario</h3>
                    <form onSubmit={handleNombre} style={estiloForm}>
                        <input 
                            type="text" 
                            value={nuevoNombre} 
                            onChange={(e) => setNuevoNombre(e.target.value)} 
                            style={estiloInput}
                        />
                        <button type="submit" style={estiloBoton}>Actualizar Nombre</button>
                    </form>
                </div>

                {/* SECCIÓN: SEGURIDAD (CONTRASEÑA) */}
                <div style={estiloSeccion}>
                    <h3>Cambiar Contraseña</h3>
                    <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        {/* Control de Contraseña Actual */}
                        <div style={{ position: 'relative', width: '100%' }}>
                            <input 
                                type={verPassActual ? "text" : "password"} 
                                placeholder="Contraseña actual" 
                                value={passActual} 
                                onChange={(e) => setPassActual(e.target.value)} 
                                style={{ ...estiloInput, width: '100%', boxSizing: 'border-box', paddingRight: '50px' }} 
                            />
                            <span onClick={() => setVerPassActual(!verPassActual)} style={estiloVerBtn}>
                                {verPassActual ? 'ocultar' : 'ver'}
                            </span>
                        </div>

                        {/* Control de Nueva Contraseña */}
                        <div style={{ position: 'relative', width: '100%' }}>
                            <input 
                                type={verPassNueva ? "text" : "password"} 
                                placeholder="Nueva contraseña" 
                                value={passNueva} 
                                onChange={(e) => setPassNueva(e.target.value)} 
                                style={{ ...estiloInput, width: '100%', boxSizing: 'border-box', paddingRight: '50px' }}
                            />
                            <span onClick={() => setVerPassNueva(!verPassNueva)} style={estiloVerBtn}>
                                {verPassNueva ? 'ocultar' : 'ver'}
                            </span>
                        </div>

                        {/* Control de Confirmación */}
                        <div style={{ position: 'relative', width: '100%' }}>
                            <input 
                                type={verPassConfirmar ? "text" : "password"} 
                                placeholder="Confirma la nueva contraseña" 
                                value={passConfirmar} 
                                onChange={(e) => setPassConfirmar(e.target.value)} 
                                style={{ ...estiloInput, width: '100%', boxSizing: 'border-box', paddingRight: '50px' }}
                            />
                            <span onClick={() => setVerPassConfirmar(!verPassConfirmar)} style={estiloVerBtn}>
                                {verPassConfirmar ? 'ocultar' : 'ver'}
                            </span>
                        </div>

                        <button type="submit" style={estiloBoton}>Guardar Nueva Contraseña</button>
                    </form>
                </div>

                {/* SECCIÓN: ZONA DE PELIGRO (BORRADO DEFINITIVO) */}
                <div style={{ ...estiloSeccion, border: '2px solid #ffcccc', backgroundColor: '#fff5f5' }}>
                    <h3 style={{ color: '#d33' }}>Zona de Peligro</h3>
                    <p style={{ color: '#666' }}>Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.</p>
                    <button onClick={handleEliminarCuenta} style={estiloBotonRojo}>ELIMINAR MI CUENTA DEFINITIVAMENTE</button>
                </div>

            </div>
            
            <div style={{ marginTop: '30px' }}>
              <Link to="/" style={{ textDecoration: 'none', color: '#888', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' }}>
                <span style={{ fontSize: '28px' }}>←</span> Volver a Inicio
              </Link>
            </div>
        </div>
    );
}

// ==========================================
// DEFINICIÓN DE ESTILOS (CSS-in-JS)
// ==========================================

const estiloSeccion = {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
};

const estiloForm = {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
};

const estiloInput = {
    flex: '1',
    minWidth: '250px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box'
};

const estiloBoton = {
    backgroundColor: '#D35400',
    color: 'white',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const estiloBotonRojo = {
    backgroundColor: '#d33',
    color: 'white',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
    marginTop: '10px'
};

const estiloVerBtn = {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#D35400',
    fontWeight: 'bold',
    userSelect: 'none',
    backgroundColor: 'white',
    padding: '0 5px',
    zIndex: 2
};

export default Configuracion;