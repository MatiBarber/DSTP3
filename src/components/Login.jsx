// components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clientId && clientSecret) {
      // Guardar las credenciales en localStorage
      localStorage.setItem('clientId', clientId);
      localStorage.setItem('clientSecret', clientSecret);
      console.log(clientId + ' ' + clientSecret);
      navigate('/artistas'); // Redirigir a la búsqueda de artistas
    } else {
      alert('Por favor ingresa ambas credenciales.');
    }
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Client ID:</label>
          <input 
            type="text" 
            value={clientId} 
            onChange={(e) => setClientId(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Client Secret:</label>
          <input 
            type="password" 
            value={clientSecret} 
            onChange={(e) => setClientSecret(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;
