import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';


function Configuracion() {
    const navigate = useNavigate();
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioRedetas'));

    // Estados para los formularios
    const [nuevoNombre, setNuevoNombre] = useState(usuarioLogueado?.username || '');
    const [passActual, setPassActual] = useState('');
    const [passNueva, setPassNueva] = useState('');
    const [passConfirmar, setPassConfirmar] = useState('');

    const idUsuario = usuarioLogueado?._id || usuarioLogueado?.id;
    
    // Estados de visibilidad de contraseña
    const [verPassActual, setVerPassActual] = useState(false);
    const [verPassNueva, setVerPassNueva] = useState(false);
    const [verPassConfirmar, setVerPassConfirmar] = useState(false);

    
    // 1. CAMBIAR NOMBRE DE USUARIO
    const handleNombre = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:3000/api/v1/usuarios/${idUsuario}`, {
                username: nuevoNombre
            });
            // Actualizamos el localStorage para que el nombre cambie en toda la web
            const usuarioActualizado = { ...usuarioLogueado, username: nuevoNombre };
            localStorage.setItem('usuarioRedetas', JSON.stringify(usuarioActualizado));
            
            Swal.fire('¡Éxito!', 'Nombre de usuario actualizado', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo cambiar el nombre', 'error');
        }
    };

    // 2. CAMBIAR CONTRASEÑA
    const handlePassword = async (e) => {
        e.preventDefault();
        
        if (passNueva !== passConfirmar) {
            return Swal.fire('Atención', 'La nueva contraseña no coincide en ambos campos', 'warning');
        }

        try {
            await axios.put(`http://localhost:3000/api/v1/usuarios/${idUsuario}/password`, {
                passwordAnterior: passActual,
                passwordNueva: passNueva
            });
            
            Swal.fire('¡Hecho!', 'Contraseña actualizada correctamente', 'success');
            setPassActual(''); setPassNueva(''); setPassConfirmar('');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.mensaje || 'Error al cambiar contraseña', 'error');
        }
    };

    // 3. ELIMINAR CUENTA (La zona roja)
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

    if (!usuarioLogueado) return <h2 style={{ textAlign: 'center' }}>Debes iniciar sesión</h2>;

    
    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
            <h1 style={{ color: '#D35400', marginBottom: '30px', textAlign: 'center' }}>AJUSTES DE CUENTA ⚙️</h1>

            <div style={{ display: 'grid', gap: '30px' }}>
                
                {/* SECCIÓN NOMBRE */}
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

                {/* SECCIÓN CONTRASEÑA CORREGIDA */}
                <div style={estiloSeccion}>
                    <h3>Cambiar Contraseña</h3>
                    <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        {/* Contraseña Actual */}
                        <div style={{ position: 'relative', width: '100%' }}>
                            <input 
                                type={verPassActual ? "text" : "password"} 
                                placeholder="Contraseña actual" 
                                value={passActual} 
                                onChange={(e) => setPassActual(e.target.value)} 
                                style={{ ...estiloInput, width: '100%', boxSizing: 'border-box', paddingRight: '50px' }} 
                            />
                            <span 
                                onClick={() => setVerPassActual(!verPassActual)} 
                                style={estiloVerBtn}
                            >
                                {verPassActual ? 'ocultar' : 'ver'}
                            </span>
                        </div>

                        {/* Nueva Contraseña */}
                        <div style={{ position: 'relative', width: '100%' }}>
                            <input 
                                type={verPassNueva ? "text" : "password"} 
                                placeholder="Nueva contraseña" 
                                value={passNueva} 
                                onChange={(e) => setPassNueva(e.target.value)} 
                                style={{ ...estiloInput, width: '100%', boxSizing: 'border-box', paddingRight: '50px' }}
                            />
                            <span 
                                onClick={() => setVerPassNueva(!verPassNueva)} 
                                style={estiloVerBtn}
                            >
                                {verPassNueva ? 'ocultar' : 'ver'}
                            </span>
                        </div>

                        {/* Confirmar Contraseña */}
                        <div style={{ position: 'relative', width: '100%' }}>
                            <input 
                                type={verPassConfirmar ? "text" : "password"} 
                                placeholder="Confirma la nueva contraseña" 
                                value={passConfirmar} 
                                onChange={(e) => setPassConfirmar(e.target.value)} 
                                style={{ ...estiloInput, width: '100%', boxSizing: 'border-box', paddingRight: '50px' }}
                            />
                            <span 
                                onClick={() => setVerPassConfirmar(!verPassConfirmar)} 
                                style={estiloVerBtn}
                            >
                                {verPassConfirmar ? 'ocultar' : 'ver'}
                            </span>
                        </div>

                        <button type="submit" style={estiloBoton}>Guardar Nueva Contraseña</button>
                    </form>
                </div>

                {/* ZONA DE PELIGRO */}
                <div style={{ ...estiloSeccion, border: '2px solid #ffcccc', backgroundColor: '#fff5f5' }}>
                    <h3 style={{ color: '#d33' }}>Zona de Peligro</h3>
                    <p style={{ color: '#666' }}>Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.</p>
                    <button onClick={handleEliminarCuenta} style={estiloBotonRojo}>ELIMINAR MI CUENTA DEFINITIVAMENTE</button>
                </div>

            </div>
             <div style={{ marginBottom: '30px' }}>
              <Link to="/" style={{ textDecoration: 'none', color: '#888', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' }}>
                <span style={{ fontSize: '28px', lineHeight: '100px' }}>←</span> Volver a Inicio
              </Link>
            </div>
        </div>
    );
}

// ESTILOS RÁPIDOS
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
    backgroundColor: 'white', // Le da un fondo para que no se vea la línea del input debajo
    padding: '0 5px'
};
export default Configuracion;