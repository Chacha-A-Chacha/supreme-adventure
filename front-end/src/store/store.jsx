import { configureStore } from '@reduxjs/toolkit';
import materialReducer from './slices/materialSlice';
import jobReducer from './slices/jobSlice';

const store = configureStore({
  reducer: {
    materials: materialReducer,
    jobs: jobReducer,
  },
});

export default store;
