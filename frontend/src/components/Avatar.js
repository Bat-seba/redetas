// *********************************************************************************************************************
//  RUTA: frontend/src/components/Avatar.js
// 
// 🔹 Este archivo sirve para mostrar el avatar de un usuario en la aplicación.
// *********************************************************************************************************************

/**
 * @fileoverview Componente visual para la representación de avatares de usuario.
 * Gestiona la visualización de imágenes de perfil o, en su defecto, la inicial del nombre de usuario.
 * @author Bat-seba Rodríguez Moreno
 */

import React from 'react';

/**
 * Renderiza un contenedor circular con la imagen del usuario o su inicial.
 * 
 * @param {Object} props.usuario - Objeto que contiene la información del usuario (username y foto_perfil_url).
 * @param {string} props.size - Dimensión de ancho y alto del componente (valor por defecto: '50px').
 */
function Avatar({ usuario, size = '50px' }) {

    /**
     * Construye la URL absoluta para la imagen de perfil apuntando al directorio estático del servidor.
     * @returns {string|null} URL de la imagen o null si no existe.
     */
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
            {/* Lógica condicional: muestra la imagen si existe URL, de lo contrario muestra la inicial */}
            {obtenerUrl() ? (
                <img 
                    src={obtenerUrl()} 
                    alt="Avatar" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
            ) : (
                usuario?.username?.charAt(0).toUpperCase()
            )}
        </div>
    );
}

export default Avatar;