// ==========================================================================================================================================
// ARCHIVO: Inicio.js es el componente principal que se muestra nada más entrar a la web de REDETAS.
// 
// 🔹 Su función es conectarse a la base de datos nada más cargar la página, traer todas las recetas y dibujarlas en una cuadrícula (Grid).
// 
// 🔹 Gestiona la lógica interactiva de cada tarjeta: permite borrar una receta o editarla sin necesidad de cambiar de página.
// ==========================================================================================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './Inicio.css';

// -------------------------------------------------------------------------------- 
// IMPORTACIÓN DE RECURSOS GRÁFICOS:
// --------------------------------------------------------------------------------

// Importación de los iconos de los alérgenos.
import iconoSinAzucar from './iconos/icono_sin_azucar.png';
import iconoSinFrutosSecos from './iconos/icono_sin_frutos_secos.png';
import iconoSinGluten from './iconos/icono_sin_gluten.png';
import iconoSinHarinas from './iconos/icono_sin_harinas.png';
import iconoSinHuevo from './iconos/icono_sin_huevo.png';
import iconoSinLeche from './iconos/icono_sin_leche.png';

// Diccionario que vincula exactamente el texto que viene de la base de datos con el archivo de imagen PNG que debe mostrar.
const iconosDiccionario = {
  'sin azúcar': iconoSinAzucar,
  'sin frutos secos': iconoSinFrutosSecos,
  'sin gluten': iconoSinGluten,
  'sin harinas': iconoSinHarinas,
  'sin huevo': iconoSinHuevo,
  'sin leche': iconoSinLeche
};

function Inicio() {
  // -------------------------------------------------------------------------------- 
  // ESTADOS DE REACT (Memoria del componente):
  // --------------------------------------------------------------------------------
  const [recetas, setRecetas] = useState([]); // Guarda la lista completa de recetas traídas de MongoDB.
  
  // Estados para controlar el "Modo Edición" de una tarjeta.
  const [idEditando, setIdEditando] = useState(null); // Guarda el ID de la receta que se está editando en este momento.
  const [datosEdicion, setDatosEdicion] = useState({ titulo: '', descripcion: '', categorias: [], foto_principal_url: '' });

  const categoriasDisponibles = ["Sin huevo", "Sin leche", "Sin azúcar", "Sin harinas", "Sin frutos secos", "Sin gluten"];

  // -------------------------------------------------------------------------------- 
  // CICLO DE VIDA (useEffect):
  // --------------------------------------------------------------------------------
  useEffect(() => {
    const obtenerRecetas = async () => {
      try {
        // [READ]: Pide al servidor el listado completo de recetas.
        const respuesta = await axios.get('http://localhost:3000/api/v1/recetas');
        setRecetas(respuesta.data); // Guarda las recetas en la memoria de React para que se dibujen.
      } catch (error) {
        console.error('Error al obtener las recetas:', error);
      }
    };
    obtenerRecetas();
  }, []);  // El array vacío [] al final significa: "Ejecuta esto SOLO UNA VEZ cuando la página cargue".


  // -------------------------------------------------------------------------------- 
  // FUNCIONES DEL CRUD (Borrar y Editar):
  // --------------------------------------------------------------------------------
  
  // Función para borrar una receta (delete) pidiendo confirmación antes.
  const eliminarReceta = async (id) => {
    const confirmacion = window.confirm('¿Estás segur@ de que quieres borrar esta receta para siempre?');
    if (confirmacion) {
      try {
        await axios.delete(`http://localhost:3000/api/v1/recetas/${id}`);
        // Se actualiza la pantalla al instante filtrando y quitando la receta borrada sin recargar la web.
        setRecetas(recetas.filter(receta => receta._id !== id));
        alert('Receta borrada correctamente 🗑️');
      } catch (error) {
        console.error('Error al borrar:', error);
      }
    }
  };

  // Prepara la tarjeta para entrar en el modo edición.
  const iniciarEdicion = (receta) => {
    setIdEditando(receta._id); // Mediante el ID se le dice a React qué tarjeta debe cambiar a modo formulario.
    // Se transforma el texto separado por comas de la BD ("Sin gluten, Sin huevo") en un Array real.
    const categoriasArray = receta.categorias ? receta.categorias.split(', ') : [];
    setDatosEdicion({ ...receta, categorias: categoriasArray }); // Se rellena el formulario con los datos actuales.
  };

  // Funciones para manejar los cambios mientras el usuario edita.
  const manejarCambioEdicion = (e) => {
    setDatosEdicion({ ...datosEdicion, [e.target.name]: e.target.value });
  };

  const manejarCheckboxEdicion = (e) => {
    const { value, checked } = e.target;
    let nuevasCategorias = [...datosEdicion.categorias];
    if (checked) {
      nuevasCategorias.push(value);
    } else {
      nuevasCategorias = nuevasCategorias.filter(cat => cat !== value);
    }
    setDatosEdicion({ ...datosEdicion, categorias: nuevasCategorias });
  };

  // Se envían los datos modificados al servidor para ser guardados.
  const guardarCambios = async (id) => {
    if (datosEdicion.categorias.length === 0) {
      alert('Selecciona al menos una categoría.');
      return;
    }

    try {
      const datosAEnviar = { ...datosEdicion, categorias: datosEdicion.categorias.join(', ') };
      const respuesta = await axios.put(`http://localhost:3000/api/v1/recetas/${id}`, datosAEnviar);
      
      // Se busca la receta vieja y se sustituye con la nueva que nos devuelve el servidor.
      setRecetas(recetas.map(rec => rec._id === id ? respuesta.data.receta : rec));
      setIdEditando(null); // Se sale del modo edición.
      alert('Receta actualizada con éxito ✏️');
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Hubo un error al guardar los cambios.');
    }
  };

  // -------------------------------------------------------------------------------- 
  // FUNCIÓN AUXILIAR: RENDERIZADO LÓGICO DE ICONOS
  // --------------------------------------------------------------------------------
  const renderizarIconosAptos = (categoriasTexto) => {
    const categoriasArray = categoriasTexto ? categoriasTexto.split(', ') : [];
    
    return (
      <div className="apto-iconos">
       {categoriasArray.map((categoria, index) => {
         // Se quitan los espacios en blanco accidentales y lo pasamos todo a minúsculas para que coincida con el diccionario y no de error.
         const nombreNormalizado = categoria.trim().toLowerCase(); 
         
         // Si la categoría existe en nuestro diccionario, dibujamos la imagen. Si no, un texto de relleno.
         return iconosDiccionario[nombreNormalizado] ? (
           <img 
              key={index} 
              src={iconosDiccionario[nombreNormalizado]} 
              alt={categoria.trim()} 
              title={categoria.trim()} 
              className="icono-categoria-img" 
            />
          ) : (
            <span key={index} className="icono-alerta">{categoria.trim().charAt(0)}</span>
          )
       })}
      </div>
    );
  };

  // -------------------------------------------------------------------------------- 
  // RENDERIZADO VISUAL DE LA PÁGINA:
  // --------------------------------------------------------------------------------
  return (
    <div>
      <h1 className="main-title">Últimas Recetas</h1>
      
      {/* Si la base de datos está vacía, mostramos un mensaje invitando a publicar */}
      {recetas.length === 0 ? (
        <p>Aún no hay recetas. ¡Anímate a subir la primera!</p>
      ) : (
        <div className="recetas-grid">
          
          {/* BUCLE .MAP() Y GESTIÓN DEL SCOPE (Alcance de variables) 
              Iteramos sobre el estado global 'recetas'. Dentro de este bucle, nace la variable 
              local 'receta' que representa una única publicación individual. */}
          {recetas.map((receta) => (
            <div key={receta._id} className="receta-card">
              
              {/* 1. SECCIÓN DE IMAGEN: Si no hay foto URL, dibuja un icono SVG por defecto */}
              <div className="card-image-container">
                {receta.foto_principal_url ? (
                  <img src={receta.foto_principal_url} alt={receta.titulo} className="card-image" />
                ) : (
                  <div className="card-image-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="1">
                        <path d="M18.8 6.2c.4-.4.4-1 0-1.4s-1-.4-1.4 0l-5.6 5.6-1.4-1.4 5.6-5.6c.4-.4.4-1 0-1.4s-1-.4-1.4 0L9 7.6 7.6 6.2 13.2.6c.4-.4.4-1 0-1.4s-1-.4-1.4 0L6.2 4.8 4.8 3.4 10.4.6c.4-.4.4-1 0-1.4s-1-.4-1.4 0L3.4 4.8 2 3.4 7.6.6c.4-.4.4-1 0-1.4s-1-.4-1.4 0L.6 4.8 2 6.2 7.6.6c.4-.4.4-1 0-1.4s-1-.4-1.4 0L.6 6.2 2 7.6l5.6 5.6 1.4 1.4-5.6 5.6c-.4.4-.4 1 0 1.4s1 .4 1.4 0L9 16.4l1.4 1.4L4.8 23.4c-.4.4-.4 1 0 1.4s1 .4 1.4 0L12 19.2l1.4 1.4-5.6 5.6c-.4.4-.4 1 0 1.4s1 .4 1.4 0L14.8 22l1.4 1.4L10.6 28.6c-.4.4-.4 1 0 1.4s1 .4 1.4 0L17.6 24.4l1.4 1.4L13.4 31.4c-.4.4-.4 1 0 1.4s1 .4 1.4 0L20.4 27.2l1.4 1.4-5.6 5.6c-.4.4-.4 1 0 1.4s1 .4 1.4 0L23.2 28.6l.6-.6c.4-.4.4-1 0-1.4s-1-.4-1.4 0l-.6.6-5.6-5.6-1.4-1.4 5.6-5.6c.4-.4.4-1 0-1.4s-1-.4-1.4 0L12 16.4l1.4-1.4z"/>
                    </svg>
                  </div>
                )}
              </div>

              <div className="card-content">
                {/* 2. RENDERIZADO CONDICIONAL (Ternario) 
                    Si el ID de la tarjeta coincide con el que estamos editando, muestra el formulario.
                    Si no, muestra la tarjeta normal. */}
                {idEditando === receta._id ? (
                  
                  // FORMULARIO DE EDICIÓN: Muestra el formulario de edición.
                  <div className="edit-form">
                    <input name="titulo" value={datosEdicion.titulo} onChange={manejarCambioEdicion} placeholder="Título" />
                    <textarea name="descripcion" value={datosEdicion.descripcion} onChange={manejarCambioEdicion} rows="3" placeholder="Descripción" />
                    
                    <div className="categorias-selector-grid">
                      {categoriasDisponibles.map(cat => (
                        <label key={cat} className="categoria-check-item">
                          <input type="checkbox" value={cat} checked={datosEdicion.categorias.includes(cat)} onChange={manejarCheckboxEdicion} />
                          {cat}
                        </label>
                      ))}
                    </div>

                    <input name="foto_principal_url" value={datosEdicion.foto_principal_url} onChange={manejarCambioEdicion} placeholder="URL de la foto" />
                    
                    <div className="form-actions-edit">
                      <button onClick={() => guardarCambios(receta._id)} className="btn-save">Guardar ✅</button>
                      <button onClick={() => setIdEditando(null)} className="btn-cancel">Cancelar ❌</button>
                    </div>
                  </div>

                ) : (
                  
                  // TARJETA NORMAL: Muestra la tarjeta con la información de la receta.
                  <div>
                    <h3 className="card-title">{receta.titulo}</h3>
                    <p className="card-description">{receta.descripcion}</p>
                    
                    {renderizarIconosAptos(receta.categorias)}

                    <button className="btn-view-recipe">
                      Ver Receta
                    </button>

                    <div className="form-actions-crud">
                      {/* Al estar dentro del Scope del .map(), la función sabe exactamente a qué receta nos referimos */}
                      <button onClick={() => iniciarEdicion(receta)} className="btn-edit-action">Editar ✏️</button>
                      <button onClick={() => eliminarReceta(receta._id)} className="btn-delete-action">Borrar 🗑️</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Inicio;