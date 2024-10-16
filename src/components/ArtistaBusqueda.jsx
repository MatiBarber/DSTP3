import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Buscador from './Buscador';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function ArtistaBusqueda() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [token, setToken] = useState('');
  const [query, setQuery] = useState(location.state?.query || '');
  const [artists, setArtists] = useState(location.state?.artists || []);
  const [favoritos, setFavoritos] = useState([]);

  // Verificar si las credenciales están en localStorage
  const CLIENT_ID = localStorage.getItem('clientId');
  const CLIENT_SECRET = localStorage.getItem('clientSecret');
  console.log(CLIENT_ID + ' ' + CLIENT_SECRET);

  useEffect(() => {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      // Si faltan credenciales, redirigir al login
      navigate('/login');
    } else {
      // Obtener token de acceso usando las credenciales del localStorage
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

  // Cargar favoritos del localStorage
  useEffect(() => {
    const favoritosGuardados = JSON.parse(localStorage.getItem('artistasfavoritos')) || [];
    setFavoritos(favoritosGuardados);
  }, []);

  const searchArtist = (artistName) => {
    setQuery(artistName);
    axios
      .get(`https://api.spotify.com/v1/search?q=${artistName}&type=artist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => setArtists(response.data.artists.items))
      .catch(error => console.error('Error al buscar artista', error));
  };

  return (
    <div>
      <h1>Buscar Artista</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 3 }}>
          <Buscador placeholder="Nombre del artista" onSearch={searchArtist} />
          <ul>
            {artists.map(artist => (
              <li key={artist.id}>
                <Link 
                  to={`/artistas/${artist.id}`} 
                  state={{ query, artists }}
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
        <div style={{ flex: 1 }}>
          <h2>Artistas Favoritos</h2>
          <ul>
            {favoritos.map(fav => (
              <li key={fav.id}>
                <Link to={`/artistas/${fav.id}`}>
                  {fav.image && (
                    <img 
                      src={fav.image} 
                      alt={fav.name} 
                      style={{ width: '50px', borderRadius: '50%' }} 
                    />
                  )}
                  <p>{fav.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ArtistaBusqueda;
