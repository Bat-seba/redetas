// ==========================================================================================================================================
// ARCHIVO: src/pages/MiCuenta.js 
// 🔹 Panel Privado del Usuario.
// ==========================================================================================================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Swal from 'sweetalert2'; 

import '../App.css';
import '../components/Inicio.css';

function MiCuenta() {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioRedetas'));
  
  // Para evitar fallos, se debe coger el ID correcto ya venga como .id o como ._id
  const idUsuario = usuarioLogueado ? (usuarioLogueado._id || usuarioLogueado.id) : null;
  
  const [misRecetas, setMisRecetas] = useState([]); 
  const [textoBusquedaLocal, setTextoBusquedaLocal] = useState(''); 
  
  const [usuarioData, setUsuarioData] = useState(null); 
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [datosPerfilEdit, setDatosPerfilEdit] = useState({ bio: '', foto_perfil_url: '' });

  const [idEditando, setIdEditando] = useState(null);
  const [datosEdicion, setDatosEdicion] = useState({ titulo: '', ingredientes: '', instrucciones: '', categorias: [], imagen: '' });
  const categoriasDisponibles = ["Sin huevo", "Sin leche", "Sin azúcar", "Sin harinas", "Sin frutos secos", "Sin gluten"];

  useEffect(() => {
    if (!usuarioLogueado) {
      navigate('/acceso');
      return;
    }

    const cargarMisRecetas = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/recetas');
        const misRecetasFiltradas = res.data.filter(receta => 
          String(receta.autor) === String(idUsuario) || 
          receta.nombreAutor === usuarioLogueado.username
        );
        setMisRecetas(misRecetasFiltradas);
      } catch (err) { console.error("Error cargando mis recetas", err); }
    };

    const cargarPerfil = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/usuarios/${idUsuario}`);
        setUsuarioData(res.data);
      } catch (err) { console.error("Error cargando perfil", err); }
    };

    cargarMisRecetas();
    cargarPerfil();
  }, [navigate, idUsuario, usuarioLogueado?.username]); 

  const iniciarEdicionPerfil = () => {
    setEditandoPerfil(true);
    setDatosPerfilEdit({
      bio: usuarioData?.bio || '',
      foto_perfil_url: usuarioData?.foto_perfil_url || ''
    });
  };

  const guardarPerfil = async () => {
    try {
      const formData = new FormData();
      formData.append('bio', datosPerfilEdit.bio);
      
      if (datosPerfilEdit.foto_perfil_url instanceof File) {
        formData.append('foto_perfil_url', datosPerfilEdit.foto_perfil_url);
      } else if (datosPerfilEdit.foto_perfil_url === '') {
        formData.append('borrar_foto', 'true'); 
      }

      const res = await axios.put(`http://localhost:3000/api/v1/usuarios/${idUsuario}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUsuarioData(res.data.usuario);
      setEditandoPerfil(false);
      Swal.fire({ title: '¡Perfil Actualizado!', text: 'Tus datos se han guardado.', icon: 'success', confirmButtonColor: '#D35400' });
    } catch (error) {
      console.error("Error completo:", error);
      const mensajeBackend = error.response?.data?.mensaje || error.message;
      Swal.fire({ 
        title: 'Error del Servidor', 
        text: `Motivo: ${mensajeBackend}`, 
        icon: 'error', 
        confirmButtonColor: '#D35400' 
      });
    }
  };

  const obtenerUrlPerfil = (foto) => {
    if (!foto) return null;
    if (foto instanceof File) return URL.createObjectURL(foto);
    return `http://localhost:3000/uploads/${foto}`;
  };

  const eliminarReceta = (id) => {
    Swal.fire({
      title: '¿Estás segur@?', text: 'Se borrará esta receta.', icon: 'warning', confirmButtonColor: '#D35400', showCancelButton: true, confirmButtonText: 'Sí, borrar', cancelButtonText: 'Cancelar'
    }).then(async (result) => { 
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/v1/recetas/${id}`);
          setMisRecetas(misRecetas.filter(r => r._id !== id));
          Swal.fire({ title: '¡Borrada!', text: 'Tu receta ha sido eliminada.', icon: 'success', confirmButtonColor: '#D35400' });
        } catch (error) { Swal.fire({ title: 'Error', text: 'No se pudo borrar.', icon: 'error', confirmButtonColor: '#D35400' }); }
      } 
    });
  };

  const iniciarEdicion = (receta) => {
    setIdEditando(receta._id);
    setDatosEdicion({ titulo: receta.titulo || '', ingredientes: receta.ingredientes || '', instrucciones: receta.instrucciones || '', categorias: receta.categorias || [], imagen: receta.imagen || '' });
  };

  const manejarCheckboxEdicion = (e) => {
    const { value, checked } = e.target;
    let nuevas = [...datosEdicion.categorias];
    if (checked) nuevas.push(value); else nuevas = nuevas.filter(c => c !== value);
    setDatosEdicion({ ...datosEdicion, categorias: nuevas });
  };

  const guardarCambios = async (id) => {
    if (!datosEdicion.titulo.trim() || !datosEdicion.ingredientes.trim() || !datosEdicion.instrucciones.trim() || datosEdicion.categorias.length === 0) {
      Swal.fire({ title: 'Campos incompletos', text: 'Rellena título, ingredientes, instrucciones y al menos una categoría.', icon: 'warning', confirmButtonColor: '#D35400' });
      return false;
    }
    try {
      const formData = new FormData();
      formData.append('titulo', datosEdicion.titulo);
      formData.append('ingredientes', datosEdicion.ingredientes);
      formData.append('instrucciones', datosEdicion.instrucciones);
      datosEdicion.categorias.forEach(cat => formData.append('categorias', cat));
      if (datosEdicion.imagen instanceof File) formData.append('imagen', datosEdicion.imagen);

      const res = await axios.put(`http://localhost:3000/api/v1/recetas/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMisRecetas(misRecetas.map(r => r._id === id ? res.data.receta : r));
      setIdEditando(null);
      Swal.fire({ title: '¡Actualizada!', text: 'Tu receta se ha guardado.', icon: 'success', confirmButtonColor: '#D35400' });
      return true;
    } catch (error) { 
      Swal.fire({ title: 'Error', text: 'Hubo un error al guardar.', icon: 'error', confirmButtonColor: '#D35400' });
      return false; 
    }
  };

  const guardarYVerReceta = async (id) => {
    const exito = await guardarCambios(id);
    if (exito) window.open(`/receta/${id}`, '_blank');
  };

  const obtenerUrlImagen = (imagen) => {
    if (!imagen) return 'https://via.placeholder.com/150';
    if (imagen instanceof File) return URL.createObjectURL(imagen);
    return `http://localhost:3000/uploads/${imagen}`;
  };

  const recetasFiltradas = misRecetas.filter(receta => receta.titulo.toLowerCase().includes(textoBusquedaLocal.toLowerCase()));

  if (!usuarioLogueado) return null;

  return (
    <main className="main-content">
      <div style={{ marginBottom: '30px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#888', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' }}>
          <span style={{ fontSize: '28px', lineHeight: '1' }}>←</span> Volver a Inicio
        </Link>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', padding: '40px', backgroundColor: 'white', borderRadius: '20px', marginBottom: '40px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <div style={{ flexShrink: 0 }}>
          {editandoPerfil ? (
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', border: '3px dashed #ccc' }}>
               {obtenerUrlPerfil(datosPerfilEdit.foto_perfil_url) ? (
                 <img src={obtenerUrlPerfil(datosPerfilEdit.foto_perfil_url)} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               ) : (
                 <span style={{ fontSize: '60px', color: '#aaa', fontWeight: 'bold' }}>{usuarioLogueado.username.charAt(0).toUpperCase()}</span>
               )}
            </div>
          ) : (
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: 'var(--naranja-fuerte)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '60px', fontWeight: 'bold', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
               {usuarioData?.foto_perfil_url ? (
                 <img src={`http://localhost:3000/uploads/${usuarioData.foto_perfil_url}`} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               ) : (
                 usuarioLogueado.username.charAt(0).toUpperCase()
               )}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ fontSize: '32px', color: 'var(--gris-texto)', margin: '0 0 10px 0' }}>{usuarioLogueado.username}</h1>
          <p style={{ color: 'var(--naranja-fuerte)', fontWeight: 'bold', fontSize: '18px', margin: '0 0 15px 0' }}>
            @{usuarioLogueado.username.toLowerCase()} • {misRecetas.length} recetas publicadas
          </p>

          {editandoPerfil ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontWeight: 'bold', color: 'var(--gris-texto)', display: 'block', marginBottom: '5px' }}>Cambiar Foto de Perfil:</label>
                <span style={{ fontSize: '14px', color: '#888', display: 'block', marginBottom: '10px' }}>Si no seleccionas ningún archivo, se mantendrá tu foto actual.</span>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="file" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) setDatosPerfilEdit({...datosPerfilEdit, foto_perfil_url: e.target.files[0]}) }} style={{ fontSize: '16px' }} />
                  {datosPerfilEdit.foto_perfil_url && (
                    <button onClick={() => setDatosPerfilEdit({...datosPerfilEdit, foto_perfil_url: ''})} style={{ padding: '8px 15px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Quitar Foto 🗑️</button>
                  )}
                </div>
              </div>

              <div>
                <label style={{ fontWeight: 'bold', color: 'var(--gris-texto)', display: 'block', marginBottom: '5px' }}>Biografía:</label>
                <textarea rows="3" value={datosPerfilEdit.bio} onChange={(e) => setDatosPerfilEdit({...datosPerfilEdit, bio: e.target.value})} placeholder="Cuéntale a la comunidad sobre ti..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', fontFamily: 'inherit' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={guardarPerfil} style={{ backgroundColor: '#22c55e', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>Guardar Perfil ✅</button>
                <button onClick={() => setEditandoPerfil(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>Cancelar ❌</button>
              </div>
            </div>
          ) : (
            <>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '16px', marginBottom: '20px' }}>{usuarioData?.bio || "Aún no has escrito una biografía. ¡Edita tu perfil para que la comunidad te conozca!"}</p>
              <button onClick={iniciarEdicionPerfil} style={{ backgroundColor: 'transparent', padding: '10px 25px', borderRadius: '25px', border: '2px solid var(--naranja-fuerte)', color: 'var(--naranja-fuerte)', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', transition: 'all 0.3s' }} onMouseOver={e => {e.target.style.backgroundColor = 'var(--naranja-fuerte)'; e.target.style.color = 'white';}} onMouseOut={e => {e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'var(--naranja-fuerte)';}}>Editar Perfil ✏️</button>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fdf8f5', padding: '20px', borderRadius: '15px' }}>
  
        {/* El buscador que ya tenías */}
        <div style={{ position: 'relative', width: '50%', display: 'flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '15px', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Buscar en tus publicaciones..." style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '10px', fontSize: '16px', border: '1px solid #ccc', outline: 'none' }} value={textoBusquedaLocal} onChange={(e) => setTextoBusquedaLocal(e.target.value)} />
        </div>

        {/* LOS DOS BOTONES JUNTOS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* Botón Favoritos (Idéntico al de DetalleReceta) */}
          <Link to="/mis-favoritos" className="boton-favorito" style={{ textDecoration: 'none' }}>
            ⭐ FAVORITOS GUARDADOS
          </Link>

          {/* Tu botón de Crear Nueva */}
          <a href="/nueva-receta" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', backgroundColor: 'var(--naranja-fuerte)', color: 'white', padding: '12px 30px', borderRadius: '30px', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 10px rgba(234, 88, 12, 0.3)' }}>
            + CREAR NUEVA ↗
          </a>
          
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '20px', color: '#666' }}>RECETA</th><th style={{ padding: '20px', color: '#666', textAlign: 'center' }}>FECHA</th><th style={{ padding: '20px', color: '#666', textAlign: 'center' }}>COMENTARIOS</th><th style={{ padding: '20px', color: '#666', textAlign: 'center' }}>YUMMYS</th><th style={{ padding: '20px', color: '#666', textAlign: 'center' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {recetasFiltradas.map(receta => (
              <tr key={receta._id} style={{ borderBottom: '1px solid #eee' }}>
                {idEditando === receta._id ? (
                  <td colSpan="5" style={{ padding: '30px', backgroundColor: '#fffbf2' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <h3 style={{ margin: 0, color: 'var(--naranja-fuerte)', fontSize: '24px' }}>✏️ Editando receta</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ccc' }}>
                        <img src={obtenerUrlImagen(datosEdicion.imagen)} alt="Previsualización" style={{ width: '100px', height: '60px', borderRadius: '5px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: 'var(--gris-texto)', fontSize: '16px' }}>Imagen de la receta:</p>
                          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                             <input type="file" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) setDatosEdicion({...datosEdicion, imagen: e.target.files[0]}) }} style={{ fontSize: '16px' }} />
                          </div>
                        </div>
                      </div>
                      <input name="titulo" placeholder="Título..." value={datosEdicion.titulo} onChange={(e) => setDatosEdicion({...datosEdicion, titulo: e.target.value})} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '20px', fontFamily: 'inherit', fontWeight: 'bold' }} />
                      <textarea name="ingredientes" rows="3" placeholder="Ingredientes..." value={datosEdicion.ingredientes} onChange={(e) => setDatosEdicion({...datosEdicion, ingredientes: e.target.value})} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '18px', fontFamily: 'inherit' }} />
                      <textarea name="instrucciones" rows="5" placeholder="Instrucciones..." value={datosEdicion.instrucciones} onChange={(e) => setDatosEdicion({...datosEdicion, instrucciones: e.target.value})} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '18px', fontFamily: 'inherit' }} />
                      <div style={{ marginTop: '10px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
                        <strong style={{ fontSize: '18px', display: 'block', marginBottom: '15px' }}>Categorías:</strong>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                          {categoriasDisponibles.map(cat => (<label key={cat} style={{ fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><input type="checkbox" value={cat} checked={datosEdicion.categorias.includes(cat)} onChange={manejarCheckboxEdicion} style={{ transform: 'scale(1.5)', cursor: 'pointer' }} />{cat}</label>))}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
                        <button onClick={() => guardarCambios(receta._id)} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>Guardar Cambios ✅</button>
                        <button onClick={() => guardarYVerReceta(receta._id)} style={{ backgroundColor: 'var(--naranja-fuerte)', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>Guardar y Ver Receta ↗</button>
                        <button onClick={() => setIdEditando(null)} style={{ backgroundColor: '#6b7280', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>Cancelar ❌</button>
                      </div>
                    </div>
                  </td>
                ) : (
                  <>
                    <td style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <a href={`/receta/${receta._id}`} target="_blank" rel="noopener noreferrer"><img src={`http://localhost:3000/uploads/${receta.imagen}`} alt="" style={{ width: '100px', height: '60px', borderRadius: '8px', objectFit: 'cover', cursor: 'pointer' }} /></a>
                      <a href={`/receta/${receta._id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--gris-texto)', fontWeight: 'bold', fontSize: '18px' }} onMouseOver={e => e.target.style.color = 'var(--naranja-fuerte)'} onMouseOut={e => e.target.style.color = 'var(--gris-texto)'}>{receta.titulo}</a>
                    </td>
                    <td style={{ textAlign: 'center', color: '#888' }}>{new Date(receta.fechaPublicacion || Date.now()).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#3b82f6' }}>{receta.comentarios?.length || 0}</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--naranja-fuerte)' }}>{receta.yummys?.length || 0} 😋</td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => iniciarEdicion(receta)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', marginRight: '15px' }} title="Editar">✏️</button>
                      <button onClick={() => eliminarReceta(receta._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }} title="Borrar">🗑️</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {recetasFiltradas.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#888', fontSize: '18px' }}>No hay recetas en tu panel que coincidan con la búsqueda.</div>}
      </div>
    </main>
  );
}

export default MiCuenta;