// frontend/src/components/Avatar.js sirve para mostrar el avatar de un usuario en la aplicación.

import React from 'react';

function Avatar({ usuario, size = '50px' }) {
  // usuario puede ser un objeto con { username, foto_perfil_url }
  const obtenerUrl = () => {
    if (usuario?.foto_perfil_url) {
      return `http://localhost:3000/uploads/${usuario.foto_perfil_url}`;
    }
    return null;
  };

  return (
    <div style={{ 
      width: size, 
      height: size, 
      borderRadius: '50%', 
      backgroundColor: 'var(--naranja-fuerte)', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      fontSize: parseInt(size) * 0.4 + 'px', 
      fontWeight: 'bold', 
      overflow: 'hidden' 
    }}>
      {obtenerUrl() ? (
        <img src={obtenerUrl()} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        usuario?.username?.charAt(0).toUpperCase()
      )}
    </div>
  );
}

export default Avatar;