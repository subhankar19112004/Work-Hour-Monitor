import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,  // User data (plain object)
  loading: false,  // Ensure loading is a boolean value
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user; // Store user data (plain object)
    },
    setLoading: (state, action) => {
      state.loading = action.payload;  // Ensure only a boolean value for loading
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

// Async thunk to login user
export const loginUser = (email, password) => async (dispatch) => {
  dispatch(setLoading(true));  // Start loading
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);  // Store the token in localStorage
    dispatch(setUser({ user }));           // Dispatch user data to Redux
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
  } finally {
    dispatch(setLoading(false));  // Stop loading
  }
};

// Async thunk to fetch user data based on token
export const fetchUser = (token) => async (dispatch) => {
  if (!token) return;

  dispatch(setLoading(true));  // Start loading
  try {
    const response = await axios.get('http://localhost:5000/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setUser({ user: response.data }));  // Dispatch the user data
  } catch (error) {
    console.error('Error fetching user data:', error.response?.data || error.message);
    dispatch(logout());  // Logout if fetching user fails
  } finally {
    dispatch(setLoading(false));  // Stop loading
  }
};

export const { setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
