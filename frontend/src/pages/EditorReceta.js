import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import axios from 'axios'; 
import logoPng from '../components/logo.png'; // Se Importa el logo para el bloque de acceso
import '../App.css'; 

function EditorReceta() {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioRedetas'));

  const [receta, setReceta] = useState({
    titulo: '',
    ingredientes: '',
    instrucciones: '',
    categorias: [], 
    imagen: null 
  });

  const [vistaPrevia, setVistaPrevia] = useState(null);

  const opcionesCategorias = [
    "Sin gluten", "Sin huevo", "Sin leche", 
    "Sin azúcar", "Sin harinas", "Sin frutos secos"
  ];

  const handleChange = (e) => {
    setReceta({ ...receta, [e.target.name]: e.target.value });
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceta({ ...receta, imagen: file });
      setVistaPrevia(URL.createObjectURL(file)); 
    }
  };

  const handleVolver = () => {
    const hayDatos = receta.titulo !== '' || receta.categorias.length > 0;
    if (hayDatos) {
      Swal.fire({
        title: '¿Estás segur@?',
        text: 'Se borrarán los datos introducidos hasta ahora.',
        icon: 'warning', 
        confirmButtonColor: '#D35400',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Me quedo'
      }).then((result) => { if (result.isConfirmed) navigate('/'); });
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // VALIDACIONES
    if (receta.titulo.trim() === '') {
        Swal.fire('¡Falta el título!', 'Por favor, dale un título a tu receta.', 'warning');
        return;
    }
    if (receta.categorias.length === 0) {
        Swal.fire('¡Atención!', 'Marca al menos una característica dietética.', 'warning');
        return;
    }
    if (receta.ingredientes.trim() === '') {
        Swal.fire('¡Faltan los ingredientes!', 'Escribe al menos uno.', 'warning');
        return;
    }
    if (receta.instrucciones.trim() === '') {
        Swal.fire('¡Faltan las instrucciones!', 'Explícanos cómo se prepara.', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('titulo', receta.titulo);
    formData.append('ingredientes', receta.ingredientes);
    formData.append('instrucciones', receta.instrucciones);
    formData.append('categorias', JSON.stringify(receta.categorias));

    const idAutor = usuarioLogueado?._id || usuarioLogueado?.id;
    formData.append('autor', idAutor); 
    formData.append('nombreAutor', usuarioLogueado?.username);

    if (receta.imagen) formData.append('imagen', receta.imagen);

    try {
        await axios.post('http://localhost:3000/api/v1/recetas/nueva', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('¡Éxito!', 'Receta publicada correctamente', 'success').then(() => navigate('/'));
    } catch (error) {
        Swal.fire('Error', 'No se pudo publicar la receta', 'error');
    }
  };

  // ESTADO DE ACCESO
  if (!usuarioLogueado) {
    return (
      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        justifyContent: 'center', height: '80vh', textAlign: 'center',
        padding: '20px', backgroundColor: '#fdf8f5' 
      }}>
        <img src={logoPng} alt="Logo Redetas" style={{ width: '120px', marginBottom: '20px', opacity: 0.9 }} />
        <h2 style={{ color: 'var(--gris-texto)', fontSize: '32px', marginBottom: '15px', fontWeight: 'bold' }}>
          ¡Queremos conocer tus recetas! 👩‍🍳
        </h2>
        <p style={{ color: '#666', fontSize: '19px', maxWidth: '600px', lineHeight: '1.6', marginBottom: '35px' }}>
          Inicia sesión o regístrate para poder compartir tus mejores platos, guardar favoritos y formar parte de nuestra comunidad culinaria.
        </p>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/acceso" style={{ 
            backgroundColor: 'var(--naranja-fuerte)', color: 'white', 
            padding: '18px 45px', borderRadius: '50px', textDecoration: 'none', 
            fontWeight: 'bold', fontSize: '20px', boxShadow: '0 6px 15px rgba(211, 84, 0, 0.3)'
          }}>
            Iniciar Sesión / Registro 🚀
          </Link>
          <Link to="/" style={{ 
            backgroundColor: 'white', color: '#888', padding: '18px 45px', 
            borderRadius: '50px', textDecoration: 'none', border: '2px solid #eee',
            fontWeight: 'bold', fontSize: '20px'
          }}>
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
      <button onClick={handleVolver} style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#D35400', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
        Volver al Inicio
      </button>

      <div style={{ padding: '30px 50px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
        <h2 style={{ textAlign: 'center', color: '#D35400', marginBottom: '30px', fontSize: '32px', fontWeight: '900' }}>
          {usuarioLogueado.username.toUpperCase()}, ESCRIBE TU RECETA 👩‍🍳
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '20px', display: 'block', marginBottom: '8px' }}>Título:</label>
            <input type="text" name="titulo" value={receta.titulo} onChange={handleChange} style={{ width: '100%', padding: '15px', fontSize: '18px', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fdf8f5', borderRadius: '8px', border: '1px solid #eee' }}>
            <label style={{ fontWeight: 'bold', fontSize: '20px', display: 'block', marginBottom: '15px', color: '#D35400' }}>
              Características Dietéticas:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {opcionesCategorias.map(cat => (
                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    value={cat} 
                    checked={receta.categorias.includes(cat)} 
                    onChange={handleCheckboxChange}
                    style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '20px', display: 'block', marginBottom: '8px' }}>Ingredientes:</label>
            <textarea name="ingredientes" value={receta.ingredientes} onChange={handleChange} rows="5" style={{ width: '100%', padding: '15px', fontSize: '18px', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '20px', display: 'block', marginBottom: '8px' }}>Instrucciones:</label>
            <textarea name="instrucciones" value={receta.instrucciones} onChange={handleChange} rows="8" style={{ width: '100%', padding: '15px', fontSize: '18px', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ marginBottom: '30px', padding: '20px', border: '2px dashed #D35400', borderRadius: '8px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '20px', display: 'block', marginBottom: '10px' }}>📸 Foto del plato:</label>
            <input id="input-foto" type="file" accept="image/*" onChange={handleImageChange} />
            {vistaPrevia && <img src={vistaPrevia} alt="Preview" style={{ display:'block', marginTop:'15px', maxHeight:'200px', borderRadius:'8px'}} />}
          </div>

          <button type="submit" style={{ width: '100%', padding: '18px', backgroundColor: '#D35400', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '22px', borderRadius: '8px' }}>
            🍳 Publicar Receta
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditorReceta;