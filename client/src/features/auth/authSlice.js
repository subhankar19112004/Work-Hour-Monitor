// // src/features/auth/authSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from '../../utils/api';
// import setAuthToken from '../../utils/setAuthToken';

// // Register user
// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async (userData, { rejectWithValue }) => {
//     try {
//       const res = await axios.post('/auth/register', userData);
//       return res.data.token;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Registration failed');
//     }
//   }
// );

// // Login user
// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const res = await axios.post('/auth/login', credentials);
//       const { token, user } = res.data;

//       // Save token to localStorage
//       localStorage.setItem('token', token);
//       setAuthToken(token);

//       return { token, user };
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Login failed');
//     }
//   }
// );

// // Get logged-in user profile
// export const fetchUserProfile = createAsyncThunk(
//   'auth/getMe',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().auth.token;
//       setAuthToken(token); // Set header before call
//       const res = await axios.get('/users/me');
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to fetch profile');
//     }
//   }
// );

// // Update user profile
// export const updateUserProfile = createAsyncThunk(
//   'auth/updateUser',
//   async (updatedData, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().auth.token;
//       setAuthToken(token);
//       const res = await axios.put('/users/me', updatedData);
//       return res.data.user;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to update profile');
//     }
//   }
// );

// const initialState = {
//   user: null,
//   token: null,
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     logout(state) {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem('token');
//       setAuthToken(null);
//     },
//     setToken(state, action) {
//       state.token = action.payload;
//       setAuthToken(action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.token;
//         state.user = action.payload.user;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(fetchUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(fetchUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(updateUserProfile.fulfilled, (state, action) => {
//         state.user = action.payload;
//       });
//   },
// });

// export const { logout, setToken } = authSlice.actions;
// export default authSlice.reducer;


// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/api';
import setAuthToken from '../../utils/setAuthToken';

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/auth/register', userData);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthToken(token);

      return { token, user };
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
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthToken(token);

      return { token, user };
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
      setAuthToken(token);
      const res = await axios.get('/users/me');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch profile');
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateUser',
  async (updatedData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      setAuthToken(token);
      const res = await axios.put('/users/me', updatedData);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to update profile');
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthToken(null);
    },
    setToken(state, action) {
      state.token = action.payload;
      setAuthToken(action.payload);
    },
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
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
        state.token = action.payload.token;
        state.user = action.payload.user;
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

      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      });
  },
});

export const { logout, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;

