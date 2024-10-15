import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Importar useLocation

function DetallesArtista() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Obtener el estado desde la navegación
  const [artista, setArtista] = useState(null);
  const [albumes, setAlbumes] = useState([]);
  const CLIENT_ID = 'e4676a48d97f46bb836322bd65f6454a';
  const CLIENT_SECRET = '52fe108040ac451da9113dfe19ff3092';

  useEffect(() => {
    axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
      },
    })
    .then(response => {
      const token = response.data.access_token;

      const artistDetails = axios.get(`https://api.spotify.com/v1/artists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const artistAlbums = axios.get(`https://api.spotify.com/v1/artists/${id}/albums`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 10 },
      });

      return Promise.all([artistDetails, artistAlbums]);
    })
    .then(([artistResponse, albumsResponse]) => {
      setArtista(artistResponse.data);
      setAlbumes(albumsResponse.data.items);
    })
    .catch(error => console.error('Error al obtener los datos', error));
  }, [id]);

  if (!artista) {
    return <p>Cargando detalles del artista...</p>;
  }

  return (
    <div>
      <h1>{artista.name}</h1>
      <img 
        src={artista.images[0]?.url} 
        alt={artista.name} 
        style={{ width: '200px', borderRadius: '50%' }} 
      />
      <p>Seguidores: {artista.followers.total}</p>
      <p>Géneros: {artista.genres.join(', ')}</p>

      <h2>Álbumes</h2>
      <ul>
        {albumes.map(album => (
          <li key={album.id}>
            <img 
              src={album.images[0]?.url} 
              alt={album.name} 
              style={{ width: '100px', borderRadius: '10%' }} 
            />
            <p>{album.name}</p>
            <p>{album.release_date}</p>
          </li>
        ))}
      </ul>

      {/* Botón para regresar a la búsqueda de artistas */}
      <button 
        onClick={() => navigate('/artistas', { state: location.state })} // Navegar con el estado original
        style={{ marginTop: '20px' }}
      >
        Volver
      </button>
    </div>
  );
}

export default DetallesArtista;
