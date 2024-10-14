import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function DetallesArtista() {
  const { id } = useParams(); // Obtiene el ID del artista de la URL
  const [artista, setArtista] = useState(null);
  const CLIENT_ID = 'e4676a48d97f46bb836322bd65f6454a';
  const CLIENT_SECRET = '52fe108040ac451da9113dfe19ff3092';

  useEffect(() => {
    // Obtener el token de autenticación de Spotify
    axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
      },
    })
    .then(response => {
      const token = response.data.access_token;
      return axios.get(`https://api.spotify.com/v1/artists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    })
    .then(response => setArtista(response.data))
    .catch(error => console.error('Error al obtener detalles del artista', error));
  }, [id]);

  if (!artista) {
    return <p>Cargando detalles del artista...</p>;
  }

  return (
    <div>
      <h1>{artista.name}</h1>
      <img src={artista.images[0]?.url} alt={artista.name} style={{ width: '200px', borderRadius: '50%' }} />
      <p>Followers: {artista.followers.total}</p>
      <p>Genres: {artista.genres.join(', ')}</p>
    </div>
  );
}

export default DetallesArtista;
