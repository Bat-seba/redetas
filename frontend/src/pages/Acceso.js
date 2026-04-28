import React, { useState } from 'react';
import '../App.css'; 
import axios from 'axios';  
import { useNavigate, Link } from 'react-router-dom';  
import Swal from 'sweetalert2'; 

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
    // VALIDACIÓN DE CONTRASEÑA (Solo complejidad: 1 min, 1 may, 1 num)
    if (!isLogin) {
    // Regex: (?=.*[a-z]) al menos una minúscula, (?=.*[A-Z]) al menos una mayúscula, (?=.*\d) al menos un número
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

  // FORMULARIO DE ACCESO Y REGISTRO
  return (
    <div className="acceso-container" style={{ textAlign: 'center', marginTop: '60px', marginBottom: '80px' }}>
      <h2 style={{ fontSize: '36px', color: '#333', marginBottom: '30px' }}>
        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '450px', margin: '0 auto', backgroundColor: '#ffffff', padding: '40px', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        
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

      {/* BOTÓN DE REGRESO A PÁGINA PRINCIPAL DE INICIO */}
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