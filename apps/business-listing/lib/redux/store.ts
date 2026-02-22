import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import businessReducer from './slices/businessSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    business: businessReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
