import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import applyReducer from '../features/apply/applySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    apply: applyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
