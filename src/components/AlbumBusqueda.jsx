// AlbumBusqueda.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Buscador from './Buscador';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function AlbumBusqueda() {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [artistName, setArtistName] = useState(location.state?.query || '');
  const [albums, setAlbums] = useState(location.state?.albums || []);
  const [favoritos, setFavoritos] = useState([]);

  // Obtener las credenciales del localStorage
  const CLIENT_ID = localStorage.getItem('clientId');
  const CLIENT_SECRET = localStorage.getItem('clientSecret');
  console.log(CLIENT_ID + ' ' + CLIENT_SECRET);

  useEffect(() => {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      // Redirigir al login si faltan credenciales
      navigate('/login');
    } else {
      // Obtener el token utilizando las credenciales almacenadas
      axios
        .post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
          },
        })
        .then(response => setToken(response.data.access_token))
        .catch(error => console.error('Error al obtener el token', error));
    }
  }, [CLIENT_ID, CLIENT_SECRET, navigate]);

  // Cargar las canciones favoritas desde el localStorage
  useEffect(() => {
    const favoritosGuardados = JSON.parse(localStorage.getItem('cancionesfavoritas')) || [];
    setFavoritos(favoritosGuardados);
  }, []);

  const searchAlbum = (artistName) => {
    setArtistName(artistName);
    axios
      .get(`https://api.spotify.com/v1/search?q=${artistName}&type=album`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => setAlbums(response.data.albums.items))
      .catch(error => console.error('Error al buscar álbumes', error));
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 3 }}>
        <h1>Buscar Álbum</h1>
        <Buscador placeholder="Nombre del álbum" onSearch={searchAlbum} />
        <ul>
          {albums.map(album => (
            <li key={album.id}>
              <Link to={`/albumes/${album.id}`} state={{ query: artistName, albums }}>
                {album.images.length > 0 && <img src={album.images[0].url} alt={album.name} />}
                <p>{album.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1 }}>
        <h2>Canciones Favoritas</h2>
        <ul>
          {favoritos.map(fav => (
            <li key={fav.id}>
              <p>{fav.name}</p>
              <button onClick={() => navigate(`/albumes/${fav.albumId}`)}>
                Ver álbum
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AlbumBusqueda;
