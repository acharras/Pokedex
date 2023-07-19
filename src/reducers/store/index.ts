import { createStore, applyMiddleware } from 'redux';
import { persistedReducer } from '../reducer/index';
import { persistStore } from 'redux-persist';

export const store = createStore(persistedReducer, applyMiddleware());

export const persistor = persistStore(store);
