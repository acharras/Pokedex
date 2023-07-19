import { combineReducers } from 'redux';
import { favoriteReducer } from './favoriteReducer';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const rootReducer = combineReducers({
  favorites: favoriteReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);