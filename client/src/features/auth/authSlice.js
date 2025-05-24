import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/api';

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/auth/register', userData);
      return res.data.token;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Registration failed');
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post('/auth/login', credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Login failed');
    }
  }
);

// Get logged-in user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/getMe',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch profile');
    }
  }
);

// Update user profile (profileUrl, age, gender)
export const updateUserProfile = createAsyncThunk(
  'auth/updateUser',
  async (updatedData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.put('/users/me', updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to update profile');
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
