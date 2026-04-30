// *********************************************************************************************************************
//  RUTA: frontend/src/components/Formulario.js 
// 
// 🔹 Este componente gestiona la interfaz y la lógica para la publicación de nuevas recetas.
// 🔹 Implementa el patrón de "Estado Controlado" para asegurar la integridad de los datos antes del envío.
// *********************************************************************************************************************

/**
 * @fileoverview Componente de formulario para la creación de recetas.
 * Maneja la captura de datos, validaciones de categorías y la comunicación asíncrona con la API.
 * @author Bat-seba Rodríguez Moreno
 */

import React, { useState } from 'react';
import axios from 'axios';

/**
 * Renderiza el formulario de publicación de recetas.
 * 
 * @returns {JSX.Element} Estructura visual del formulario de creación.
 */
function Formulario() {
    // Definición de las categorías preestablecidas para la clasificación de alérgenos
    const categoriasDisponibles = [
        "Sin huevo", 
        "Sin leche", 
        "Sin azúcar", 
        "Sin harinas", 
        "Sin frutos secos", 
        "Sin gluten"
    ];

    /**
     * Estado local del formulario.
     * Almacena temporalmente los valores introducidos por el usuario antes de la persistencia.
     */
    const [receta, setReceta] = useState({
        titulo: '',
        descripcion: '',
        categorias: [],
        foto_principal_url: ''
    });

    /**
     * Actualiza el estado del formulario de forma dinámica.
     * Utiliza el atributo 'name' del input para identificar el campo a modificar.
     * 
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - Evento de cambio.
     */
    const handleChange = (e) => {
        setReceta({
            ...receta,
            [e.target.name]: e.target.value
        });
    };

    /**
     * Gestiona la selección y deselección de categorías mediante checkboxes.
     * Implementa lógica de filtrado para mantener el estado sincronizado con la selección del usuario.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio del checkbox.
     */
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let nuevasCategorias = [...receta.categorias];

        if (checked) {
            nuevasCategorias.push(value); 
        } else {
            nuevasCategorias = nuevasCategorias.filter(cat => cat !== value); 
        }

        setReceta({ ...receta, categorias: nuevasCategorias });
    };

    /**
     * Procesa el envío del formulario al servidor.
     * Realiza validaciones preventivas y formatea el objeto de datos para la API.
     * 
     * @param {React.FormEvent} e - Evento de envío del formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de negocio: requisito mínimo de una categoría seleccionada
        if (receta.categorias.length === 0) {
            alert('Por favor, selecciona al menos una categoría para tu receta.');
            return; 
        }

        try {
            // Normalización de datos: conversión del array de categorías a una cadena de texto
            const datosAEnviar = {
                ...receta,
                categorias: receta.categorias.join(', ')
            };

            // Ejecución de la petición POST hacia el endpoint de recetas
            await axios.post('http://localhost:3000/api/v1/recetas', datosAEnviar);
            alert('¡Receta publicada con éxito!');
            
            // Reinicio del estado para limpiar los campos de la interfaz
            setReceta({ titulo: '', descripcion: '', categorias: [], foto_principal_url: '' });
            
        } catch (error) {
            console.error('Error en la comunicación con el servidor:', error);
            alert('Error al conectar con el servidor.');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2>Añadir Nueva Receta</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div>
                    <label><strong>Título:</strong></label>
                    <input 
                        type="text" 
                        name="titulo" 
                        value={receta.titulo} 
                        onChange={handleChange} 
                        required 
                        style={estiloInput} 
                    />
                </div>

                <div>
                    <label><strong>Descripción y pasos:</strong></label>
                    <textarea 
                        name="descripcion" 
                        value={receta.descripcion} 
                        onChange={handleChange} 
                        required 
                        rows="5" 
                        style={estiloInput} 
                    />
                </div>

                {/* SECCIÓN DE CATEGORÍAS OBLIGATORIAS */}
                <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
                    <label><strong>¿Para quién es apta esta receta? (Selecciona al menos una):</strong></label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: '10px' }}>
                        {categoriasDisponibles.map(cat => (
                            <label key={cat} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}>
                                <input 
                                    type="checkbox" 
                                    value={cat} 
                                    checked={receta.categorias.includes(cat)} 
                                    onChange={handleCheckboxChange} 
                                    style={{ marginRight: '10px' }}
                                />
                                {cat}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label><strong>URL de la foto (Opcional):</strong></label>
                    <input 
                        type="text" 
                        name="foto_principal_url" 
                        value={receta.foto_principal_url} 
                        onChange={handleChange} 
                        style={estiloInput} 
                    />
                </div>

                <button type="submit" style={estiloBoton}>Publicar Receta</button>
            </form>
        </div>
    );
}

// Definición de constantes para el diseño de componentes en línea
const estiloInput = { 
    width: '100%', 
    padding: '10px', 
    marginTop: '5px', 
    borderRadius: '5px', 
    border: '1px solid #ccc',
    boxSizing: 'border-box'
};

const estiloBoton = { 
    padding: '12px', 
    backgroundColor: '#28a745', 
    color: 'white', 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    fontSize: '16px' 
};

export default Formulario;