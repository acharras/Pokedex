import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { PokemonList } from './components/pokemonList/pokemonList';
import { FavoritePokemonList } from './components/favoritePokemonList/favoritePokemonList';
import { NotFound } from './components/notFound/notFound';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const apiUrl = 'https://pokeapi.co/api/v2/';

export interface PokemonType {
    name: string;
}

interface Pokemon {
    name: string;
    url: string;
    image: string;
    typeNames: string[];
    gameIndex: number;
    pokemonData: any;
    evolutionRank: number;
  }

function App() {
	const [typeList, setTypeList] = useState<PokemonType[]>([]);
	

	const fetchTypeList = async () => {
		try {
		if (!typeList.length)
            {
                const typeResponse = await axios.get(apiUrl + 'type/');
                const typeResults: Pokemon[] = typeResponse.data.results;

                const typeDataPromises = typeResults.map(async (type) => {
                    const name = type.name;
                
                    return { name } as PokemonType;
                })

                const typeData = await Promise.all(typeDataPromises);
                setTypeList(typeData);
            }
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
        fetchTypeList();
// eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
  
	return (
    <>
    	<Router>
			<Switch>
				<Route exact path={'/'} render={() => <PokemonList typeList={typeList} />} />
				<Route exact path={'/favourite'} render={() => <FavoritePokemonList typeList={typeList} />} />
				<Route component={NotFound} />
			</Switch>
    	</Router>
    </>
	);
}

export default App;