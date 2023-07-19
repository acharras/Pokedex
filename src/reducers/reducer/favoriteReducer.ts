import { ADD_FAVORITE_POKEMON, REMOVE_FAVORITE_POKEMON } from '../actions/index';
import { FavoriteState } from '../actions/types';


const initialState: FavoriteState = {
  favorites: [],
};

export const favoriteReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_FAVORITE_POKEMON:
      if (!state.favorites.find((pokemon) => pokemon.name === action.payload.name)) {
        return {
          ...state,
          favorites: [...state.favorites, action.payload],
        };
      }
      return state;

    case REMOVE_FAVORITE_POKEMON:
      const updatedFavorites = state.favorites.filter((pokemon) => pokemon.name !== action.payload.name);
      return {
        ...state,
        favorites: updatedFavorites,
      };

    default:
      return state;
  }
};
