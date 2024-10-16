import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ArtistaBusqueda from './components/ArtistaBusqueda'; // Vista de búsqueda de artistas
import AlbumBusqueda from './components/AlbumBusqueda'; // Vista de búsqueda de álbumes
import DetallesArtista from './components/DetalleArtista'; // Componente de detalles del artista
import CancionesAlbum from './components/CancionesAlbum'; // Componente de canciones del álbum
import Login from './components/Login'; // Componente de login
import './App.css';

function App() {
  const isAuthenticated = localStorage.getItem('clientId') && localStorage.getItem('clientSecret');
  console.log(isAuthenticated);

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

        {/* Configuración de rutas */}
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/artistas" : "/login"} />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/artistas" 
            element={isAuthenticated ? <ArtistaBusqueda /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/albumes" 
            element={isAuthenticated ? <AlbumBusqueda /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/artistas/:id" 
            element={isAuthenticated ? <DetallesArtista /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/albumes/:id" 
            element={isAuthenticated ? <CancionesAlbum /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
