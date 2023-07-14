import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Home } from './components/home/home';
import './App.css';

export const apiUrl = 'https://pokeapi.co/api/v2/';

function Menu(data: any) {
  
	return (
    	<>
			<Route exact path={"/"} component={Home} />
		</>
	)
}

function App() {
  
	return (
    <>
    <Router>
			<Switch>
				<Menu />
			</Switch>
    </Router>
    </>
	);
}

export default App;