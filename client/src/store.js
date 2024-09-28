// store.js
import allReducers from './reducers/index';
import { configureStore } from '@reduxjs/toolkit';

const userInfoFromStorage = typeof window !== 'undefined'
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const store = configureStore({
  reducer: allReducers,
  preloadedState: {
    userLoginReducer: {
      userInfo: userInfoFromStorage,
    },
  },
});

export default store;
