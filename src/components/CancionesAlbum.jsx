// CancionesAlbum.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CancionesAlbum() {
  const { id } = useParams(); // Obtiene el ID del álbum de la URL
  const [canciones, setCanciones] = useState([]);
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
      return axios.get(`https://api.spotify.com/v1/albums/${id}/tracks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    })
    .then(response => setCanciones(response.data.items))
    .catch(error => console.error('Error al obtener canciones del álbum', error));
  }, [id]);

  return (
    <div>
      <h1>Canciones del Álbum</h1>
      <ul>
        {canciones.map(cancion => (
          <li key={cancion.id}>{cancion.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default CancionesAlbum;
