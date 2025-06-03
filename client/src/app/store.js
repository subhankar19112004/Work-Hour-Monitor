import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import attendanceReducer from '../features/attendance/attendanceSlice'; // ✅ import it
import adminReducer from "../features/admin/adminSlice";
import leaveReducer from '../features/leave/leaveSlice';
import snapshotReducer from '../features/snapshot/snapshotSlice'; 
export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer, // ✅ add it to the reducer map
    admin: adminReducer,
    leave: leaveReducer, // Add leave reducer
    snapshot: snapshotReducer, // Add snapshot reducer  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setLoading', 'auth/setUser'],
      },
    }),
});
