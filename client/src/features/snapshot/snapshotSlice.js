// src/features/snapshot/snapshotSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/api'; // Assuming axios is configured with the correct base URL

// Fetch snapshots from the backend API
export const fetchSnapshots = createAsyncThunk(
  'snapshot/fetchSnapshots',
  async (_, { rejectWithValue }) => {
    try {
      // Perform the GET request to the backend
      const response = await axios.get('http://localhost:5000/api/snapshot/');
      console.log('Fetched snapshots from API:', response.data); // Log the full response

      // Check if the response contains an array and return it
      if (Array.isArray(response.data)) {
        return response.data; // If it's already an array, return it directly
      } else {
        console.error('Unexpected response structure', response.data);
        return rejectWithValue('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching snapshots:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch snapshots');
    }
  }
);

// Upload a new snapshot (Base64 string) to the backend
export const uploadSnapshot = createAsyncThunk(
  'snapshot/uploadSnapshot',
  async (imageBase64, { rejectWithValue }) => {
    try {
      const userId = 'someUserId'; // Replace with actual userId from your authentication system
      const response = await axios.post('http://localhost:5000/api/snapshot/upload', { photo: imageBase64, userId });
      console.log('Snapshot uploaded:', response.data); // Log the uploaded snapshot data
      return response.data.snapshot; // Return the uploaded snapshot object
    } catch (error) {
      console.error('Error uploading snapshot:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to upload snapshot');
    }
  }
);

const snapshotSlice = createSlice({
  name: 'snapshot',
  initialState: {
    snapshots: [], // Initialize with an empty array
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle the pending state for fetchSnapshots (request is in progress)
      .addCase(fetchSnapshots.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      // Handle the fulfilled state for fetchSnapshots (successful fetch)
      .addCase(fetchSnapshots.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false
        console.log('Fetched snapshots (fulfilled):', action.payload); // Log the payload for debugging
        state.snapshots = action.payload; // Store the snapshots array in the state
      })
      // Handle the rejected state for fetchSnapshots (fetch failed)
      .addCase(fetchSnapshots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch snapshots'; // Set error message
        console.error('Error fetching snapshots (rejected):', action.payload); // Log error
      })
      // Handle the pending state for uploadSnapshot (uploading snapshot)
      .addCase(uploadSnapshot.pending, (state) => {
        state.loading = true;
      })
      // Handle the fulfilled state for uploadSnapshot (successful upload)
      .addCase(uploadSnapshot.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false
        console.log('Snapshot uploaded (fulfilled):', action.payload); // Log the uploaded snapshot for debugging
        state.snapshots.push(action.payload); // Add the new snapshot to the state
      })
      // Handle the rejected state for uploadSnapshot (upload failed)
      .addCase(uploadSnapshot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to upload snapshot'; // Set error message
        console.error('Error uploading snapshot (rejected):', action.payload); // Log error
      });
  },
});

export default snapshotSlice.reducer;
