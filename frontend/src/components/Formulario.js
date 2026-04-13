// ==========================================================================================================================================
// ARCHIVO: Formulario.js es el componente que renderiza la pantalla para publicar nuevas recetas.
// 
// 🔹 Su función es capturar los datos que introduce el usuario (título, descripción, etc.), validarlos y enviarlos al servidor de forma segura.
// 
// 🔹 Al utilizarse el "Estado Controlado" (useState) de React se permite que la interfaz sea interactiva y que se pueda preparar y formatear 
//     los datos antes de enviarlos al servidor.
// ==========================================================================================================================================


import React, { useState } from 'react';

// Se importa Axios para enviar las peticiones HTTP al servidor.
import axios from 'axios';

/**********************************************************************************************************
 * FORMULARIO QUE RENDERIZA LA PANTALLA PARA PUBLICAR NUEVAS RECETAS:
 * 
 * @returns {JSX.Element} Un formulario que contiene los campos para publicar una receta.
 *********************************************************************************************************/
function Formulario() {
  // Lista fija con las categorías oficiales de las recetas.
  const categoriasDisponibles = [
    "Sin huevo", 
    "Sin leche", 
    "Sin azúcar", 
    "Sin harinas", 
    "Sin frutos secos", 
    "Sin gluten"
  ];

  /**********************************************************************************************************************
   * GESTIÓN DEL ESTADO DEL FORMULARIO QUE CONTIENE LOS DATOS DE LA RECETA QUE SE VA A PUBLICAR:
   * Memoria temporal del formulario donde 'receta' es un objeto que guarda lo que el usuario esta escribiendo. 
   * @type {{ titulo: string, descripcion: string, categorias: string[], foto_principal_url: string }}
   **********************************************************************************************************************/
  const [receta, setReceta] = useState({
    titulo: '',
    descripcion: '',
    categorias: [],      // Array para almacenar las categorías seleccionadas está inicialmente vacío.
    foto_principal_url: ''
  });

  /**********************************************************************************************************************
   * MANEJADORES DE EVENTOS QUE ACTUALIZAN EL ESTADO DEL FORMULARIO AL PRODUCIRSE UN CAMBIO EN LOS DATOS DE LA RECETA:
   * @param {React.ChangeEvent} e - El evento que se produce cuando se modifica un input.
   *********************************************************************************************************************/
  
  /* Función que se encarga de actualizar el estado de la receta cada vez que se produce un cambio en un input. */
  const handleChange = (e) => {
    setReceta({
      ...receta,               // Copia el estado anterior de la receta manteniendo los datos que aun no se han actualizado.
      [e.target.name]: e.target.value    // Actualiza el valor solo del campo que ha cambiado.
    });
  };

  /* Función específica para manejar las casillas de verificación de las categorías de los alérgenos (checkboxes). */
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let nuevasCategorias = [...receta.categorias];     // Se hace copia del array de categorias actual.

    // Si la casilla de verificación ha sido marcada, se agrega la categoría a la lista de categorías. Sino se desmarca, se elimina.
    if (checked) {
      nuevasCategorias.push(value); 
    } else {
      nuevasCategorias = nuevasCategorias.filter(cat => cat !== value); 
    }

    setReceta({ ...receta, categorias: nuevasCategorias });   // Se guarda la nueva lista de categorías en el estado de la receta, en la memoria de React.
  };

  /**********************************************************************************************************************
   * ENVÍO DE DATOS DE LA RECETA AL SERVIDOR CUANDO SE PRODUCE UN SUBMIT EN EL FORMULARIO:
   * @param {React.FormEvent} e - El evento que se produce cuando el usuario pulsa el botón de "Publicar Receta".
   *********************************************************************************************************************/
  const handleSubmit = async (e) => {
    e.preventDefault();     // Evita que la pantalla se recargue al enviar el formulario.

    // 1. VALIDACIÓN: Se obligar al usuario a poner al menos una categoría.
    if (receta.categorias.length === 0) {
      alert('Por favor, selecciona al menos una categoría para tu receta.');
      return; 
    }

    // 2. PREPARACIÓN DE DATOS: Se formatean los datos de la receta antes de enviarlos al servidor.
    try {
      const datosAEnviar = {
        ...receta,
        categorias: receta.categorias.join(', ')   // Uso de join para convertir el array de categorías en una cadena separada por comas.
      };

      // 3. ENVÍO DE DATOS AL SERVIDOR: Se utiliza Axios para enviar la receta al servidor con el método POST.
      await axios.post('http://localhost:3000/api/v1/recetas', datosAEnviar);
      alert('¡Receta publicada con éxito! 🎉');
      
      // 4. LIMPIEZA DEL FORMULARIO: Se limpia el formulario despues de enviar la receta.
      setReceta({ titulo: '', descripcion: '', categorias: [], foto_principal_url: '' });
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  /***********************************************************************************************************************
   * RENDERIZACIÓN DEL FORMULARIO EN LA PUBLICAICIÓN DE UNA NUEVA RECETA:
   * @returns {JSX.Element} Un formulario que contiene los campos para publicar una receta.
   **********************************************************************************************************************/
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2> Añadir Nueva Receta</h2>
      <h2>➕ Añadir Nueva Receta</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div>
          <label><strong>Título:</strong></label>
          <input type="text" name="titulo" value={receta.titulo} onChange={handleChange} required style={estiloInput} />
        </div>

        <div>
          <label><strong>Descripción y pasos:</strong></label>
          <textarea name="descripcion" value={receta.descripcion} onChange={handleChange} required rows="5" style={estiloInput} />
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
          <input type="text" name="foto_principal_url" value={receta.foto_principal_url} onChange={handleChange} style={estiloInput} />
        </div>

        <button type="submit" style={estiloBoton}>Publicar Receta</button>
      </form>
    </div>
  );
}

// Estilos visuales en línea para mantener una apariencia agradable.
const estiloInput = { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' };
const estiloBoton = { padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };

export default Formulario;