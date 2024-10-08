import '../App.css';
import Lista from './Lista';

function Buscador(props) {
  return (
    <div className="Buscador">
      <form onSubmit={props.searchArtist}>
        <input 
          type="text" 
          value={props.artista} 
          onChange={(e) => props.setArtista(e.target.value)} // Actualizamos el estado con el valor ingresado
          placeholder="¿Qué artista quieres buscar?" 
        />
        <button type="submit">Buscar</button>
      </form>    
    </div>

    
  );
}

export default Buscador;

/*
<form>
            <input type='text' placeholder='¿Que quieres escuchar?'/>
            <button type='submit'>Buscar</button>
        </form>
        <Lista></Lista>
*/