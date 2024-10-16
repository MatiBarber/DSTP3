import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArtistaBusqueda from './components/ArtistaBusqueda'; // Vista de búsqueda de artistas
import AlbumBusqueda from './components/AlbumBusqueda'; // Vista de búsqueda de álbumes
import DetallesArtista from './components/DetalleArtista'; // Componente de detalles del artista
import CancionesAlbum from './components/CancionesAlbum'; // Componente de canciones del álbum
import './App.css';

function App() {
  return (
    <Router>
      <div>
        {/* Menú de navegación */}
        <nav>
          <ul>
            <li>
              <Link to="/artistas">Buscar Artista</Link>
            </li>
            <li>
              <Link to="/albumes">Buscar Álbum</Link>
            </li>
          </ul>
        </nav>

        {/* Configuración de rutas. */}
        <Routes>
          <Route path="/artistas" element={<ArtistaBusqueda />} />
          <Route path="/albumes" element={<AlbumBusqueda />} />
          <Route path="/artistas/:id" element={<DetallesArtista />} /> {/* Ruta para detalles del artista */}
          <Route path="/albumes/:id" element={<CancionesAlbum />} /> {/* Ruta para canciones del álbum */}
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;