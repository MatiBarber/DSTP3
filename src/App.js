import axios from 'axios';
import './App.css';
import { useEffect, useState } from 'react';
import Buscador from './components/Buscador';

function App() {  
  const CLIENT_ID = 'e4676a48d97f46bb836322bd65f6454a';
  const CLIENT_SECRET = '52fe108040ac451da9113dfe19ff3092';

  const [artists, setArtists] = useState([]); // Estado para almacenar los artistas
  const [artista, setArtista] = useState(''); // Estado para manejar el término de búsqueda
  const [token, setToken] = useState(''); // Estado para guardar el token

  // Función para obtener el token de autenticación
  function requestToken() {
    axios.post("https://accounts.spotify.com/api/token",
      'grant_type=client_credentials', // Formato correcto para enviar los parámetros
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
        },
      })
      .then((response) => {
        const token = response.data.access_token;
        setToken(token); // Guardamos el token en el estado
        console.log(`Token received: ${token}`);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  }

  // Función para buscar un artista en Spotify
  function searchArtist(e)  {
    e.preventDefault(); // Prevenir que el formulario recargue la página
    
    if (!artista) {
      alert('Por favor, ingresa el nombre de un artista');
      return;
    }

    axios.get(`https://api.spotify.com/v1/search?q=${artista}&type=artist`, {
      headers: {
        Authorization: `Bearer ${token}` // Usamos el token de autorización
      }
    })
    .then((response) => {
      setArtists(response.data.artists.items); // Actualizamos la lista de artistas
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // Ejecutar la solicitud del token al cargar la aplicación
  useEffect(() => {
    requestToken();
  }, []);

  return (
    <div className="App">
      <h1>Spotify Artist Search</h1>
      
      <Buscador artista={artista} setArtista={setArtista} searchArtist={searchArtist}></Buscador>

      {/* Listado de artistas */}
      <h2>Artistas encontrados:</h2>
      <ul>
        {artists.map((artist, index) => (
          <li key={artist.id}>
            {/* Si el artista tiene imagen, mostrarla */}
            {artist.images.length > 0 && (
              <img 
                src={artist.images[0].url} 
                alt={artist.name} 
                style={{ width: '100px', borderRadius: '50%' }} 
              />
            )}
            <p>{artist.name}</p> {/* Mostrar el nombre del artista */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

/*

import axios from 'axios';
import './App.css';
import Buscador from './components/Buscador';
import { useEffect, useState } from 'react';

function App() {  
  const CLIENT_ID = 'e4676a48d97f46bb836322bd65f6454a'
  const CLIENT_SECRET = '52fe108040ac451da9113dfe19ff3092'

  const [artists, setArtists] = useState([])

  function requestToken() {
    axios.post("https://accounts.spotify.com/api/token",
      {
        grant_type:"client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }, 
      }).then((data) => {
        console.log(`Yay! Token received, it is: ${data.data.access_token}`)
        // instead of saving the token, we can configure axios to add the auth header
        // to every future request
        axios.defaults.headers.common['Authorization'] = "Bearer " + data.data.access_token;
        // make a search to test it
        searchArtist("Adele")
      }).catch((error) => {
        console.log(`Error: ${error}`)
        console.log(error)
      })
  }

  function searchArtist(artist){
    axios.get(`https://api.spotify.com/v1/search?q=${artist}&type=artist`)
    .then((data) => {
      console.log(data.data.artists.items)
      setArtists(data.data.artists.items)
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    // this code run when app starts...
    requestToken()
  })

  return (
    <div className="App">
      <h1>App de Musica en Spotify</h1>
      <Buscador></Buscador>

      <form>
          <input type='text' placeholder='¿Que quieres escuchar?' />
          <button type='submit'>Buscar</button>
      </form>

      <h1>Artists</h1>
      <ul>
        {artists.map((artist, index) => {
          return <li key={index}>{artist.name}</li>
        })}
      </ul>
    </div>
  );
}

export default App;

*/