import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function CancionesAlbum() {
  const { id } = useParams(); // Obtener ID del álbum de la URL
  const [album, setAlbum] = useState(null); // Estado para los detalles del álbum
  const [canciones, setCanciones] = useState([]);
  const CLIENT_ID = 'e4676a48d97f46bb836322bd65f6454a';
  const CLIENT_SECRET = '52fe108040ac451da9113dfe19ff3092';
  const navigate = useNavigate(); // Hook para navegar entre páginas
  const location = useLocation(); // Recupera el estado desde AlbumBusqueda

  useEffect(() => {
    // Obtener el token de autenticación
    axios
      .post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
        },
      })
      .then(response => {
        const token = response.data.access_token;

        // Solicitar detalles del álbum y sus canciones
        return axios.get(`https://api.spotify.com/v1/albums/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then(response => {
        setAlbum(response.data); // Guardar detalles del álbum
        setCanciones(response.data.tracks.items); // Guardar canciones
      })
      .catch(error => console.error('Error al obtener detalles del álbum', error));
  }, [id]);

  if (!album) {
    return <p>Cargando detalles del álbum...</p>;
  }

  return (
    <div>
      <h1>{album.name}</h1>
      <p><strong>Artista:</strong> {album.artists[0].name}</p>
      <img 
        src={album.images[0]?.url} 
        alt={album.name} 
        style={{ width: '300px', borderRadius: '10%' }} 
      />

      <h2>Lista de Canciones</h2>
      <ul>
        {canciones.map(cancion => (
          <li key={cancion.id}>{cancion.name}</li>
        ))}
      </ul>

      <button 
        onClick={() => navigate(`/artistas/${album.artists[0].id}`)} 
        style={{ marginTop: '20px' }}
      >
        Ir al artista
      </button>

      <button 
        onClick={() => navigate('/albumes', { state: location.state })} 
        style={{ marginTop: '20px', marginLeft: '10px' }}
      >
        Volver
      </button>
    </div>
  );
}

export default CancionesAlbum;
