import { Pokemon } from '../../components/pokemonList/pokemonList';

export enum FavoriteActionTypes {
  ADD_FAVORITE_POKEMON = 'ADD_FAVORITE_POKEMON',
}

interface AddFavoritePokemonAction {
  type: FavoriteActionTypes.ADD_FAVORITE_POKEMON;
  payload: Pokemon;
}

export type FavoriteAction = AddFavoritePokemonAction;

export interface FavoriteState {
  favorites: Pokemon[];
}