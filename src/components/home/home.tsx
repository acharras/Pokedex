import "./home.css"
import { PokemonList } from '../pokemonList/pokemonList';

export function Home() {

    return(
        <div className="Homepage">
            <h1>PokeBealy</h1>
            <PokemonList />
            
        </div>
    );
}