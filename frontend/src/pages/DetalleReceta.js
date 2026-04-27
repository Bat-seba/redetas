// ==========================================================================================================================================
// ARCHIVO: DetalleReceta.js 
// 🔹 Detalle de una receta.
// ==========================================================================================================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import logoPng from '../components/logo.png'; 
import '../App.css';
import '../components/DetalleReceta.css';

import iconoSinAzucar from '../components/iconos/icono_sin_azucar.png';
import iconoSinFrutosSecos from '../components/iconos/icono_sin_frutos_secos.png';
import iconoSinGluten from '../components/iconos/icono_sin_gluten.png';
import iconoSinHarinas from '../components/iconos/icono_sin_harinas.png';
import iconoSinHuevo from '../components/iconos/icono_sin_huevo.png';
import iconoSinLeche from '../components/iconos/icono_sin_leche.png';

function DetalleReceta() {
  const { id } = useParams();    // Para obtener el id de la receta
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioRedetas'));  // Para saber si el usuario esta logueado
  
  const [receta, setReceta] = useState(null);    //  Para mostrar la receta
  const [recetasSimilares, setRecetasSimilares] = useState([]);   // Para mostrar recetas similares
  
  const [yummysArray, setYummysArray] = useState([]);    // Para mostrar los yummys
  const [animarBeso, setAnimarBeso] = useState(false);     // Para animar el beso
  const [comentarios, setComentarios] = useState([]);    // Para mostrar los comentarios
  const [nuevoComentario, setNuevoComentario] = useState("");   // Para publicar un comentario
  
  const [comentarioAResponder, setComentarioAResponder] = useState(null);    // Para responder a un comentario
  const [textoRespuesta, setTextoRespuesta] = useState("");    // Para responder a un comentario
  const [datosUsuarioHeader, setDatosUsuarioHeader] = useState(null);   // Foto del usuario logueado actualizada en el header

  const mapaIconos = {
    "Sin gluten": iconoSinGluten, "Sin huevo": iconoSinHuevo, "Sin leche": iconoSinLeche,
    "Sin azúcar": iconoSinAzucar, "Sin harinas": iconoSinHarinas, "Sin frutos secos": iconoSinFrutosSecos
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioRedetas'); window.location.href = '/'; 
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1. Se carga la receta 
        const resReceta = await axios.get(`http://localhost:3000/api/v1/recetas/${id}`);
        setReceta(resReceta.data);
        setYummysArray(resReceta.data.yummys || []);
        setComentarios(resReceta.data.comentarios || []);

        // 2. Se cargan recetas similares
        const resSimilares = await axios.get('http://localhost:3000/api/v1/recetas');
        const filtradas = resSimilares.data.filter(r => r._id !== id).slice(0, 4); 
        setRecetasSimilares(filtradas);

        // 3. Se cargan los datos del usuario logueado para el header
        if (usuarioLogueado) {
          const userId = usuarioLogueado._id || usuarioLogueado.id;
          const resUser = await axios.get(`http://localhost:3000/api/v1/usuarios/${userId}`);
          setDatosUsuarioHeader(resUser.data);
        }

      } catch (err) { console.error("Error cargando datos", err); }
    };
    cargarDatos();
    window.scrollTo(0, 0);
  }, [id]); 

  const handleYummy = async () => {
    if (!usuarioLogueado) {
      return Swal.fire('¡Ups!', 'Si quieres dejar tu Yummy😋, inicia sesión o regístrate.', 'info');
    }
    setAnimarBeso(true);
    setTimeout(() => setAnimarBeso(false), 600); 
    try {
      const res = await axios.put(`http://localhost:3000/api/v1/recetas/${id}/yummy`, {
        userId: usuarioLogueado._id || usuarioLogueado.id
      });
      setYummysArray(res.data);
    } catch (error) { console.error("Error Yummy"); }
  };

  const handlePublicarComentario = async () => {
    if (!usuarioLogueado) return Swal.fire('¡Ups!', 'Inicia sesión para comentar.', 'info');
    if (nuevoComentario.trim() === "") return;
    try {
      const res = await axios.post(`http://localhost:3000/api/v1/recetas/${id}/comentarios`, {
        usuarioId: usuarioLogueado._id || usuarioLogueado.id,
        nombreUsuario: usuarioLogueado.username,
        texto: nuevoComentario
      });
      setComentarios(res.data);
      setNuevoComentario(""); 
    } catch (error) { console.error("Error publicando"); }
  };

  const handleEliminarComentario = async (comentarioId) => {
    Swal.fire({
      title: '¿Seguro?', text: "Se borrará este comentario.", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#888', confirmButtonText: 'Sí, borrar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`http://localhost:3000/api/v1/recetas/${id}/comentarios/${comentarioId}`);
          setComentarios(res.data);
        } catch (error) { console.error("Error eliminar"); }
      }
    });
  };

  const handleEnviarRespuesta = async (comentarioId) => {
    if (textoRespuesta.trim() === "") return;
    try {
      const res = await axios.post(`http://localhost:3000/api/v1/recetas/${id}/comentarios/${comentarioId}/respuestas`, {
        usuarioId: usuarioLogueado._id || usuarioLogueado.id,
        nombreUsuario: usuarioLogueado.username,
        texto: textoRespuesta
      });
      setComentarios(res.data);
      setComentarioAResponder(null); 
      setTextoRespuesta(""); 
    } catch (error) { console.error("Error respondiendo"); }
  };

  const handleEliminarRespuesta = async (comentarioId, respuestaId) => {
    Swal.fire({
      title: '¿Borrar respuesta?', icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#888', confirmButtonText: 'Borrar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`http://localhost:3000/api/v1/recetas/${id}/comentarios/${comentarioId}/respuestas/${respuestaId}`);
          setComentarios(res.data);
        } catch (error) { console.error("Error eliminar respuesta"); }
      }
    });
  };

  const proximoAviso = () => Swal.fire('¡Próximamente!', 'Función disponible pronto.', 'info');

  if (!receta) return <div style={{textAlign: 'center', marginTop: '50px'}}><h2>Cargando... ⏳</h2></div>;

  const idUsuarioActual = usuarioLogueado ? (usuarioLogueado._id || usuarioLogueado.id) : null;
  const yaDiYummy = yummysArray.includes(idUsuarioActual);

  return (
    <>
      <header className="main-header">
        <div className="header-container">
          <Link to="/" className="logo-container">
            <img src={logoPng} alt="Logo Redetas" className="logo-image" />
          </Link>
          <nav className="nav-links">
            <Link to="/">Inicio</Link> <Link to="/#">Recetas</Link> <Link to="/#">Comunidad</Link>
          </nav>
          <div className="header-actions">
            {/* Círculo de perfil y botón de cerrar sesión */}
            {usuarioLogueado ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to="/mi-cuenta" style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#D35400', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', textDecoration: 'none' }}>
                  {datosUsuarioHeader?.foto_perfil_url ? (
                    <img src={`http://localhost:3000/uploads/${datosUsuarioHeader.foto_perfil_url}`} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontWeight: 'bold' }}>{usuarioLogueado.username.charAt(0).toUpperCase()}</span>
                  )}
                </Link>
                <button onClick={cerrarSesion} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }}>(Salir)</button>
              </div>
            ) : (
              <Link to="/acceso" style={{fontWeight: 'bold', color: '#D35400', fontSize: '18px', textDecoration: 'none'}}>Entrar</Link>
            )}
            <Link to="/nueva-receta" className="publish-button" style={{fontSize: '16px', marginLeft: '15px'}}>Publicar Receta</Link>
          </div>
        </div>
      </header>

      <main className="detalle-layout">
        <div className="detalle-principal">
          <h1 className="detalle-titulo">{receta.titulo}</h1>
          <div className="receta-cuerpo-grid">
            
            <div>
              <img src={`http://localhost:3000/uploads/${receta.imagen}`} alt={receta.titulo} className="detalle-foto" />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                <Link to={`/perfil/${receta.autor?._id || receta.autor}`} style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  
                  {/* Círculo con imagen del autor de la receta*/}
                  <div style={{ width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#D35400', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '24px', overflow: 'hidden' }}>
                    {receta.autor?.foto_perfil_url ? (
                      <img src={`http://localhost:3000/uploads/${receta.autor.foto_perfil_url}`} alt="Chef" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      receta.nombreAutor ? receta.nombreAutor.charAt(0).toUpperCase() : 'U'
                    )}
                  </div>

                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: '22px', display: 'block' }}>{receta.nombreAutor}</span>
                    <span style={{ fontSize: '15px', color: '#888'}}>Chef de Redetas</span>
                  </div>
                </Link>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px'}}>
                   <div onClick={handleYummy} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none', position: 'relative', fontSize: '30px' }}>
                     <span className={animarBeso ? 'cara-besando' : ''} style={{ opacity: yaDiYummy ? 1 : 0.35, filter: yaDiYummy ? 'none' : 'grayscale(100%)', display: 'inline-block' }}>😋</span>
                     {animarBeso && ( <span className="corazon-volador" style={{ position: 'absolute', left: '20px', top: '0px', fontSize: '26px' }}>❤️</span> )}
                     <span style={{ color: '#D35400', fontWeight: 'bold' }}>{yummysArray.length}</span>
                   </div>
                   <button className="boton-favorito" onClick={proximoAviso}>⭐ Guardar</button>
                </div>
              </div>

              {/* COMENTARIOS */}
              <h2 style={{color: '#333', borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px', fontSize: '24px'}}>💬 Comentarios ({comentarios.length})</h2>
              
              <div style={{marginTop: '20px', marginBottom: '30px'}}>
                <textarea value={nuevoComentario} onChange={(e) => setNuevoComentario(e.target.value)} placeholder="Escribe un comentario..." style={{width: '100%', boxSizing: 'border-box', padding: '15px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', fontSize: '18px', minHeight: '100px'}}></textarea>
                <button onClick={handlePublicarComentario} style={{padding: '15px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '18px'}}>Publicar Comentario</button>
              </div>

              <div>
                {comentarios.slice().reverse().map((com, index) => {
                  const esMiComentario = usuarioLogueado && (com.usuarioId === idUsuarioActual);
                  return (
                    <div key={com.id || index} style={{marginBottom: '25px'}}>
                      <div className="comentario-caja">
                        <span style={{fontWeight: 'bold', color: '#D35400', display: 'block', marginBottom: '5px', fontSize: '18px'}}>{com.nombreUsuario}</span>
                        <span style={{fontSize: '18px', color: '#444'}}>{com.texto}</span>
                        {com.id && (
                          <div className="acciones-comentario">
                            <button className="btn-accion-comentario" onClick={() => setComentarioAResponder(comentarioAResponder === com.id ? null : com.id)}>Responder</button>
                            {esMiComentario && <button className="btn-accion-comentario btn-borrar" onClick={() => handleEliminarComentario(com.id)}>Borrar</button>}
                          </div>
                        )}
                      </div>
                      {comentarioAResponder === com.id && (
                        <div className="caja-responder" style={{ marginTop: '10px' }}>
                          <textarea value={textoRespuesta} onChange={(e) => setTextoRespuesta(e.target.value)} placeholder="Responde..." style={{width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px'}}></textarea>
                          <div style={{display: 'flex', gap: '10px', marginTop: '5px'}}>
                            <button onClick={() => handleEnviarRespuesta(com.id)} style={{padding: '8px 15px', backgroundColor: '#D35400', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Enviar</button>
                            <button onClick={() => setComentarioAResponder(null)} style={{padding: '8px 15px', backgroundColor: '#eee', border: 'none', borderRadius: '5px'}}>Cancelar</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="apto-iconos" style={{marginBottom: '25px'}}>
                {receta.categorias && receta.categorias.map(cat => (
                  <div key={cat} className="contenedor-icono-magico">
                    <img src={mapaIconos[cat]} alt={cat} className="icono-categoria-img" style={{width: '55px', height: '55px'}} />
                    <span className="texto-flotante">{cat}</span>
                  </div>
                ))}
              </div>
              <h2 style={{color: '#D35400', marginBottom: '20px', fontSize: '26px'}}>🛒 Ingredientes</h2>
              <div className="seccion-texto" style={{backgroundColor: '#FDF8F5', padding: '25px', borderRadius: '12px', borderLeft: '6px solid #D35400', fontSize: '18px', whiteSpace: 'pre-wrap'}}>
                {receta.ingredientes}
              </div>
              <h2 style={{color: '#D35400', marginBottom: '20px', marginTop: '40px', fontSize: '26px'}}>👩‍🍳 Preparación</h2>
              <div className="seccion-texto" style={{padding: '0 10px', fontSize: '18px', lineHeight: '1.6', whiteSpace: 'pre-wrap'}}>
                {receta.instrucciones}
              </div>
            </div>

          </div>
        </div>

        <aside className="detalle-sidebar">
          <h3 className="sidebar-titulo">Sigue descubriendo</h3>
          {recetasSimilares.map((sim) => (
            <Link to={`/receta/${sim._id}`} key={sim._id} className="receta-similar-card">
              <img src={`http://localhost:3000/uploads/${sim.imagen}`} alt={sim.titulo} className="similar-foto" />
              <div className="similar-info">
                <h4 className="similar-titulo">{sim.titulo}</h4>
                <div className="similar-stats">
                  <span style={{fontSize: '14px', color: '#888'}}>Por {sim.nombreAutor}</span>
                </div>
              </div>
            </Link>
          ))}
        </aside>
      </main>
    </>
  );
}

export default DetalleReceta;