import { configureStore } from '@reduxjs/toolkit';
import materialReducer from './slices/materialSlice';

const store = configureStore({
  reducer: {
    materials: materialReducer,
  },
});

export default  store;
