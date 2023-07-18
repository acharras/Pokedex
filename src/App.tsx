import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { PokemonList } from './components/pokemonList/pokemonList';
import './App.css';

export const apiUrl = 'https://pokeapi.co/api/v2/';

function App() {
  
	return (
    <>
    	<Router>
			<Switch>
				<Route exact path={"/"} component={PokemonList} />
			</Switch>
    	</Router>
    </>
	);
}

export default App;