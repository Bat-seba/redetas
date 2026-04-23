import React, { useState } from 'react';
import '../App.css'; 
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Swal from 'sweetalert2'; // Importamos la magia de SweetAlert2

function Acceso() {
  const navigate = useNavigate();  
  const [isLogin, setIsLogin] = useState(true);  

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
      try {
        const respuesta = await axios.post('http://localhost:3000/api/v1/auth/login', {
          email: formData.email,
          password: formData.password
        });

        // Aviso elegante de ÉXITO (Login)
        await Swal.fire({
          title: '¡Bienvenido a Redetas!',
          text: respuesta.data.mensaje,
          icon: 'success',
          confirmButtonColor: '#D35400'
        });
        
        localStorage.setItem('usuarioRedetas', JSON.stringify(respuesta.data.usuario));
        navigate('/');

      } catch (error) {
        // Aviso elegante de ERROR (Login)
        Swal.fire({
          title: 'Ups...',
          text: error.response ? error.response.data.mensaje : "Error de conexión con el servidor.",
          icon: 'error',
          confirmButtonColor: '#D35400'
        });
      }
    } else {
      try {
        const respuesta = await axios.post('http://localhost:3000/api/v1/auth/registro', {
          username: formData.username,
          email: formData.email,
          password: formData.password
        });

        // Aviso elegante de ÉXITO (Registro)
        Swal.fire({
          title: '¡Cuenta creada!',
          text: respuesta.data.mensaje,
          icon: 'success',
          confirmButtonColor: '#D35400'
        });
        
        setFormData({ username: '', email: '', password: '' });
        setIsLogin(true); 

      } catch (error) {
        // Aviso elegante de ERROR (Registro)
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