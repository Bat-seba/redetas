// *********************************************************************************************************************
//  RUTA: frontend/src/pages/Acceso.js 
// 
// 🔹 Este componente gestiona la vista de autenticación dual (Inicio de sesión y Registro de nuevos usuarios).
// 🔹 Implementa validaciones de seguridad en el lado del cliente y gestiona la persistencia local de la sesión.
// *********************************************************************************************************************

/**
 * @fileoverview Vista de acceso a la plataforma.
 * Maneja el estado de los formularios, la validación de contraseñas mediante expresiones regulares y la integración con SweetAlert2.
 * @author Bat-seba Rodríguez Moreno
 */

import React, { useState } from 'react';
import '../App.css'; 
import axios from 'axios';  
import { useNavigate, Link } from 'react-router-dom';  
import Swal from 'sweetalert2'; 

/**
 * Componente funcional que renderiza el formulario de Acceso/Registro.
 * 
 * @returns {JSX.Element} Interfaz de usuario para la autenticación.
 */
function Acceso() {
    const navigate = useNavigate();  
    
    // Estado para alternar entre el modo 'Login' y el modo 'Registro'
    const [isLogin, setIsLogin] = useState(true);  

    // Estado centralizado para capturar los campos del formulario
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    /**
     * Sincroniza los cambios en los inputs con el estado local del componente.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio en el campo de texto.
     */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    /**
     * Procesa el envío del formulario realizando validaciones previas y peticiones asíncronas al servidor.
     * 
     * @param {React.FormEvent} e - Evento de envío del formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        // Validación de robustez de contraseña para nuevos registros
        if (!isLogin) {
            /* Expresión regular: requiere al menos una minúscula, una mayúscula y un número */
            const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/;
      
            if (!regexPassword.test(formData.password)) {
                return Swal.fire({
                    title: 'Contraseña insegura',
                    text: 'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número.',
                    icon: 'warning',
                    confirmButtonColor: '#D35400'
                });
            }
        }

        if (isLogin) {
            // Lógica para el inicio de sesión
            try {
                const respuesta = await axios.post('http://localhost:3000/api/v1/auth/login', {
                    email: formData.email,
                    password: formData.password
                });

                await Swal.fire({
                    title: '¡Bienvenido a Redetas!',
                    text: respuesta.data.mensaje,
                    icon: 'success',
                    confirmButtonColor: '#D35400'
                });
                
                // Almacenamiento de los datos del usuario en el LocalStorage para mantener la sesión activa
                localStorage.setItem('usuarioRedetas', JSON.stringify(respuesta.data.usuario));
                navigate('/');

            } catch (error) {
                Swal.fire({
                    title: 'Ups...',
                    text: error.response ? error.response.data.mensaje : "Error de conexión con el servidor.",
                    icon: 'error',
                    confirmButtonColor: '#D35400'
                });
            }
        } else {
            // Lógica para el registro de nueva cuenta
            try {
                const respuesta = await axios.post('http://localhost:3000/api/v1/auth/registro', {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                });

                Swal.fire({
                    title: '¡Cuenta creada!',
                    text: respuesta.data.mensaje,
                    icon: 'success',
                    confirmButtonColor: '#D35400'
                });
                
                // Reinicia el formulario y cambia automáticamente al modo login tras el éxito
                setFormData({ username: '', email: '', password: '' });
                setIsLogin(true); 

            } catch (error) {
                Swal.fire({
                    title: 'Error al registrar',
                    text: error.response ? error.response.data.mensaje : "Error de conexión con el servidor.",
                    icon: 'error',
                    confirmButtonColor: '#D35400'
                });
            }
        }
    };

    return (
        <div className="acceso-container" style={{ textAlign: 'center', marginTop: '60px', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '36px', color: '#333', marginBottom: '30px' }}>
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ maxWidth: '450px', margin: '0 auto', backgroundColor: '#ffffff', padding: '40px', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
                
                {/* Renderizado condicional: el campo de username solo se muestra en el modo Registro */}
                {!isLogin && (
                    <div style={{ marginBottom: '20px' }}>
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="Nombre de usuario" 
                            value={formData.username}
                            onChange={handleChange}
                            required 
                            style={{ width: '100%', padding: '15px', fontSize: '18px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Correo electrónico" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                        style={{ width: '100%', padding: '15px', fontSize: '18px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Contraseña" 
                        value={formData.password}
                        onChange={handleChange}
                        required 
                        style={{ width: '100%', padding: '15px', fontSize: '18px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>

                <button 
                    type="submit" 
                    style={{ width: '100%', padding: '15px', backgroundColor: '#D35400', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '20px' }}
                >
                    {isLogin ? 'Entrar' : 'Registrarse'}
                </button>
            </form>

            <div style={{ marginTop: '30px', fontSize: '18px' }}>
                <p>
                    {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes cuenta? '}
                    <span 
                        onClick={() => setIsLogin(!isLogin)} 
                        style={{ color: '#D35400', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                    >
                        {isLogin ? 'REGÍSTRATE AHORA' : 'INICIA SESIÓN'}
                    </span>
                </p>
            </div>

            {/* Enlace de navegación para navegación pública (invitados) */}
            <div style={{ marginTop: '50px' }}>
                <Link 
                    to="/" 
                    style={{ 
                        color: '#888', 
                        textDecoration: 'none', 
                        fontWeight: 'bold', 
                        fontSize: '18px', 
                        border: '2px solid #eee', 
                        padding: '12px 30px', 
                        borderRadius: '30px', 
                        display: 'inline-block',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    ⬅ Seguir viendo recetas sin entrar
                </Link>
            </div>
        </div>
    );
}

export default Acceso;