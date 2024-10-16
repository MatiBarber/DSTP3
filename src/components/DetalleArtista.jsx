import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';

function DetallesArtista() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [artista, setArtista] = useState(null);
  const [albumes, setAlbumes] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const CLIENT_ID = 'e4676a48d97f46bb836322bd65f6454a';
  const CLIENT_SECRET = '52fe108040ac451da9113dfe19ff3092';

  // Verificar si el artista es favorito al cargar la vista
  useEffect(() => {
    const favoritos = JSON.parse(localStorage.getItem('artistasfavoritos')) || [];
    setIsFavorite(favoritos.some(fav => fav.id === id));
  }, [id]);

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

  const toggleFavorite = () => {
    const favoritos = JSON.parse(localStorage.getItem('artistasfavoritos')) || [];
    if (isFavorite) {
      // Remover de favoritos
      const nuevosFavoritos = favoritos.filter(fav => fav.id !== id);
      localStorage.setItem('artistasfavoritos', JSON.stringify(nuevosFavoritos));
      setIsFavorite(false);
    } else {
      // Agregar a favoritos
      favoritos.push({ id, name: artista.name, image: artista.images[0]?.url });
      localStorage.setItem('artistasfavoritos', JSON.stringify(favoritos));
      setIsFavorite(true);
    }
  };

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

      <button onClick={toggleFavorite} style={{ marginTop: '20px' }}>
        {isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
      </button>

      <h2>Álbumes</h2>
      <ul>
        {albumes.map(album => (
          <li key={album.id}>
            <Link to={`/albumes/${album.id}`}> {/* Enlace para ir al detalle del álbum */}
              <img 
                src={album.images[0]?.url} 
                alt={album.name} 
                style={{ width: '100px', borderRadius: '10%' }} 
              />
              <p>{album.name}</p>
              <p>{album.release_date}</p>
            </Link>
          </li>
        ))}
      </ul>

      <button 
        onClick={() => navigate('/artistas', { state: location.state })} 
        style={{ marginTop: '20px' }}
      >
        Volver
      </button>
    </div>
  );
}

export default DetallesArtista;
