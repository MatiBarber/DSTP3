import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Buscador from './Buscador';
import { Link, useLocation } from 'react-router-dom';

function ArtistaBusqueda() {
  const CLIENT_ID = 'e4676a48d97f46bb836322bd65f6454a';
  const CLIENT_SECRET = '52fe108040ac451da9113dfe19ff3092';
  const location = useLocation(); // Obtenemos el estado de la navegación
  const [token, setToken] = useState('');
  const [query, setQuery] = useState(location.state?.query || ''); // Cargar la búsqueda anterior si existe
  const [artists, setArtists] = useState(location.state?.artists || []); // Cargar resultados previos si existen

  useEffect(() => {
    axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
      },
    })
    .then(response => setToken(response.data.access_token))
    .catch(error => console.error('Error al obtener el token', error));
  }, []);

  const searchArtist = (artistName) => {
    setQuery(artistName); // Guardar la búsqueda actual
    axios.get(`https://api.spotify.com/v1/search?q=${artistName}&type=artist`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => setArtists(response.data.artists.items))
    .catch(error => console.error('Error al buscar artista', error));
  };

  return (
    <div>
      <h1>Buscar Artista</h1>
      <Buscador placeholder="Nombre del artista" onSearch={searchArtist} />
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            <Link 
              to={`/artistas/${artist.id}`} 
              state={{ query, artists }} // Pasar la búsqueda y los resultados como estado
            >
              {artist.images.length > 0 && (
                <img 
                  src={artist.images[0].url} 
                  alt={artist.name} 
                  style={{ width: '100px', borderRadius: '50%' }} 
                />
              )}
              <p>{artist.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArtistaBusqueda;
