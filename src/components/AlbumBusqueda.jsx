import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Buscador from './Buscador';
import { Link, useLocation } from 'react-router-dom';

function AlbumBusqueda() {
  const CLIENT_ID = 'e4676a48d97f46bb836322bd65f6454a';
  const CLIENT_SECRET = '52fe108040ac451da9113dfe19ff3092';

  // Recuperar los resultados previos desde el estado de `useLocation`
  const location = useLocation();
  const [token, setToken] = useState('');
  const [artistName, setArtistName] = useState(location.state?.query || '');
  const [albums, setAlbums] = useState(location.state?.albums || []);

  // Obtener el token de Spotify al montar el componente
  useEffect(() => {
    axios
      .post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
        },
      })
      .then(response => setToken(response.data.access_token))
      .catch(error => console.error('Error al obtener el token', error));
  }, []);

  // Función para buscar álbumes por nombre de artista
  const searchAlbum = (artistName) => {
    setArtistName(artistName); // Guardar el nombre del artista
    axios
      .get(`https://api.spotify.com/v1/search?q=${artistName}&type=album`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => setAlbums(response.data.albums.items))
      .catch(error => console.error('Error al buscar álbumes', error));
  };

  return (
    <div>
      <h1>Buscar Álbum</h1>
      <Buscador placeholder="Nombre del álbum" onSearch={searchAlbum} />
      <ul>
        {albums.map(album => (
          <li key={album.id}>
            <Link 
              to={`/albumes/${album.id}`} 
              state={{ query: artistName, albums }} // Pasamos el estado para mantener resultados
            >
              {album.images.length > 0 && (
                <img src={album.images[0].url} alt={album.name} />
              )}
              <p>{album.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlbumBusqueda;
