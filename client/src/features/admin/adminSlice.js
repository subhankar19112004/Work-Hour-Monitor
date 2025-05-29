// src/features/admin/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/api';
import setAuthToken from '../../utils/setAuthToken';

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, { getState, rejectWithValue }) => {
  try {
    setAuthToken(getState().auth.token);
    const res = await axios.get('/users');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { getState, rejectWithValue }) => {
  try {
    setAuthToken(getState().auth.token);
    await axios.delete(`/users/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { getState, rejectWithValue }) => {
    try {
      setAuthToken(getState().auth.token);
      const res = await axios.put(`/users/${userId}/role`, { role });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'admin/updateUserProfile',
  async ({ userId, userData }, { getState, rejectWithValue }) => {
    try {
      setAuthToken(getState().auth.token);
      const res = await axios.put(`/users/${userId}`, userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.users.findIndex(u => u._id === updated._id);
        if (idx !== -1) state.users[idx] = updated;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.users.findIndex(u => u._id === updated._id);
        if (idx !== -1) state.users[idx] = updated;
      });
  },
});

export default adminSlice.reducer;
