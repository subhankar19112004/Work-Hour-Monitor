import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/api';

// Apply Leave (for employees)
export const applyLeave = createAsyncThunk(
  'leave/apply',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/leave/request', leaveData);
      return response.data.leaveRequest;  // Return the leave request object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply leave');
    }
  }
);

// Fetch all leave requests (for admin)
export const fetchLeaveRequests = createAsyncThunk(
  'leave/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/leave/all');
      return response.data.leaveRequests;  // Return all leave requests
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave requests');
    }
  }
);

// Approve Leave (for admin)
export const approveLeave = createAsyncThunk(
  'leave/approve',
  async (leaveId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/leave/approve/${leaveId}`);
      return response.data.leaveRequest;  // Return the updated leave request
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve leave');
    }
  }
);

// Reject Leave (for admin)
export const rejectLeave = createAsyncThunk(
  'leave/reject',
  async (leaveId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/leave/reject/${leaveId}`);
      return response.data.leaveRequest;  // Return the updated leave request
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject leave');
    }
  }
);

const initialState = {
  leaveRequests: [],
  loading: false,
  error: null,
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(applyLeave.pending, (state) => {
        state.loading = true;
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests.push(action.payload);
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = action.payload;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveLeave.fulfilled, (state, action) => {
        const index = state.leaveRequests.findIndex((request) => request._id === action.payload._id);
        if (index !== -1) {
          state.leaveRequests[index] = action.payload;
        }
      })
      .addCase(rejectLeave.fulfilled, (state, action) => {
        const index = state.leaveRequests.findIndex((request) => request._id === action.payload._id);
        if (index !== -1) {
          state.leaveRequests[index] = action.payload;
        }
      });
  },
});

export default leaveSlice.reducer;
