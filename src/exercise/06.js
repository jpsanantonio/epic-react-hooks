// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon';

function PokemonInfo({ pokemonName }) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  });

  React.useEffect(() => {
    if (pokemonName) {
      setState({ status: 'pending' });
      fetchPokemon(pokemonName)
        .then(pokemon => {
          setState({ status: 'resolved', pokemon });
        })
        .catch(error => {
          setState({ status: 'rejected', error });
        });
    }
  }, [pokemonName]);

  if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if (state.status === 'rejected') {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{ whiteSpace: 'normal' }}>{state.error.message}</pre>
      </div>
    );
  } else if (state.status === 'resolved') {
    return <PokemonDataView pokemon={state.pokemon} />;
  } else {
    return 'Submit a pokemon';
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('');

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  );
}

export default App;
