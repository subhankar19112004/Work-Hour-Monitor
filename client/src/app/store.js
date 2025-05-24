import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import attendanceReducer from '../features/attendance/attendanceSlice'; // ✅ import it

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer, // ✅ add it to the reducer map
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setLoading', 'auth/setUser'],
      },
    }),
});
