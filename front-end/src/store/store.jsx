import { configureStore } from '@reduxjs/toolkit';
import materialReducer from './slices/materialSlice';
import jobReducer from './slices/jobSlice';

const store = configureStore({
  reducer: {
    materials: materialReducer,
    jobs: jobReducer,
    // ... other reducers if any
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain action types
        ignoredActions: ['jobs/fetchJobDetails/fulfilled'],
        // Ignore certain paths in the state
        ignoredPaths: ['jobs.entities'],
      },
      // Increase the threshold for the serializable check
      thresholdMS: 100,
    }),
});

export default store;
