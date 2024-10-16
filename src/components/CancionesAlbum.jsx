// CancionesAlbum.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function CancionesAlbum() {
  const { id } = useParams(); // Obtener ID del álbum
  const [album, setAlbum] = useState(null);
  const [canciones, setCanciones] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const CLIENT_ID = 'e4676a48d97f46bb836322bd65f6454a';
  const CLIENT_SECRET = '52fe108040ac451da9113dfe19ff3092';

  // Obtener el token y datos del álbum
  useEffect(() => {
    axios
      .post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
        },
      })
      .then(response => axios.get(`https://api.spotify.com/v1/albums/${id}`, {
        headers: { Authorization: `Bearer ${response.data.access_token}` },
      }))
      .then(response => {
        setAlbum(response.data);
        setCanciones(response.data.tracks.items);
      })
      .catch(error => console.error('Error al obtener detalles del álbum', error));
  }, [id]);

  // Verificar si la canción es favorita
  const isFavorite = (songId) => {
    const favoritos = JSON.parse(localStorage.getItem('cancionesfavoritas')) || [];
    return favoritos.some(fav => fav.id === songId);
  };

  // Alternar canción favorita
  const toggleFavorite = (cancion) => {
    const favoritos = JSON.parse(localStorage.getItem('cancionesfavoritas')) || [];
    const index = favoritos.findIndex(fav => fav.id === cancion.id);

    if (index > -1) {
      // Si ya es favorita, la eliminamos
      favoritos.splice(index, 1);
    } else {
      // Si no, la agregamos
      favoritos.push({
        id: cancion.id,
        name: cancion.name,
        albumId: id,
        albumName: album.name,
      });
    }
    localStorage.setItem('cancionesfavoritas', JSON.stringify(favoritos));
  };

  if (!album) return <p>Cargando detalles del álbum...</p>;

  return (
    <div>
      <h1>{album.name}</h1>
      <p><strong>Artista:</strong> {album.artists[0].name}</p>
      <img src={album.images[0]?.url} alt={album.name} style={{ width: '300px', borderRadius: '10%' }} />

      <h2>Lista de Canciones</h2>
      <ul>
        {canciones.map(cancion => (
          <li key={cancion.id}>
            {cancion.name}
            <button 
              onClick={() => toggleFavorite(cancion)} 
              style={{ marginLeft: '10px' }}
            >
              {isFavorite(cancion.id) ? 'Remover de favoritos' : 'Agregar a favoritos'}
            </button>
          </li>
        ))}
      </ul>

      <button onClick={() => navigate(`/artistas/${album.artists[0].id}`)} style={{ marginTop: '20px' }}>
        Ir al artista
      </button>

      <button onClick={() => navigate('/albumes', { state: location.state })} style={{ marginTop: '20px', marginLeft: '10px' }}>
        Volver
      </button>
    </div>
  );
}

export default CancionesAlbum;
