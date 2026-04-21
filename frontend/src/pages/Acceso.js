import React, { useState } from 'react';
import '../App.css'; // Importamos tu CSS principal para mantener el diseño
import axios from 'axios';  // Importamos Axios
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate para navegar entre rutas de la web

function Acceso() {
  const navigate = useNavigate();  // Hook para navegar entre rutas
  const [isLogin, setIsLogin] = useState(true);  // Iniciamos con el formulario de Login

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (isLogin) {
      // === AQUÍ EMPIEZA LA CONEXIÓN REAL DE LOGIN ===
      try {
        const respuesta = await axios.post('http://localhost:3000/api/v1/auth/login', {
          email: formData.email,
          password: formData.password
        });

        alert("¡Bienvenido a Redetas! " + respuesta.data.mensaje); 
        
        // Guardamos los datos del usuario en la memoria del navegador
        localStorage.setItem('usuarioRedetas', JSON.stringify(respuesta.data.usuario));
        
        // ¡Magia! Redirigimos al usuario a la página de inicio
        navigate('/');

      } catch (error) {
        if (error.response) {
          alert("Error: " + error.response.data.mensaje); // Ej: Credenciales incorrectas
        } else {
          alert("Error de conexión con el servidor.");
        }
      }
    } else {
      // === AQUÍ EMPIEZA LA CONEXIÓN REAL DE REGISTRO ===
      try {
        const respuesta = await axios.post('http://localhost:3000/api/v1/auth/registro', {
          username: formData.username,
          email: formData.email,
          password: formData.password
        });

        alert("¡Éxito! " + respuesta.data.mensaje); 
        
        // Limpiamos el formulario y le pasamos a la pestaña de Login para que entre
        setFormData({ username: '', email: '', password: '' });
        setIsLogin(true); 

      } catch (error) {
        if (error.response) {
          alert("Error: " + error.response.data.mensaje);
        } else {
          alert("Error de conexión con el servidor. ¿Está encendido Node.js?");
        }
      }
    }
  };

  return (
    <div className="acceso-container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: '0 auto' }}>
        
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="text" 
              name="username" 
              placeholder="Nombre de usuario" 
              value={formData.username}
              onChange={handleChange}
              required 
              style={{ width: '100%', padding: '10px' }}
            />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <input 
            type="email" 
            name="email" 
            placeholder="Correo electrónico" 
            value={formData.email}
            onChange={handleChange}
            required 
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input 
            type="password" 
            name="password" 
            placeholder="Contraseña" 
            value={formData.password}
            onChange={handleChange}
            required 
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '12px', backgroundColor: '#D35400', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isLogin ? 'Entrar' : 'Registrarse'}
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
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
    </div>
  );
}

export default Acceso;