import React, { useState } from 'react';

function Buscador({ placeholder, onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      onSearch(query); // Ejecutar la función de búsqueda pasada como prop//
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder={placeholder} 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <button type="submit">Buscar</button>
    </form>
  );
}

export default Buscador;
