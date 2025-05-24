// src/features/attendance/attendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/api';

export const fetchTodayAttendance = createAsyncThunk(
  'attendance/fetchToday',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get('/attendance/today', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching attendance');
    }
  }
);

export const fetchAttendanceHistory = createAsyncThunk(
  'attendance/history',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get('/attendance/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching history');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    today: {
      punchInTime: null,
      punchOutTime: null,
    },
    history: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.today.punchInTime = action.payload.punchInTime;
        state.today.punchOutTime = action.payload.punchOutTime;
      })
      .addCase(fetchTodayAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAttendanceHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchAttendanceHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default attendanceSlice.reducer;
