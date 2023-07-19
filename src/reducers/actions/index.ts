import { Pokemon } from '../../components/pokemonList/pokemonList'

export const ADD_FAVORITE_POKEMON = 'ADD_FAVORITE_POKEMON';
export const REMOVE_FAVORITE_POKEMON = 'REMOVE_FAVORITE_POKEMON';


export const addFavoritePokemon = (pokemon: Pokemon) => {
  return {
    type: ADD_FAVORITE_POKEMON,
    payload: pokemon,
  };
};

export const removeFavoritePokemon = (pokemon: Pokemon) => {
  return {
    type: REMOVE_FAVORITE_POKEMON,
    payload: pokemon,
  };
};