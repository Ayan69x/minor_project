import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/leaveType/leaveType';

// Create a new leave type
export const createLeaveType = createAsyncThunk(
  'leaveTypes/createLeaveType',
  async (leaveTypeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/create`, leaveTypeData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Attach the token
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create leave type');
    }
  }
);

// View all leave types
export const fetchLeaveTypes = createAsyncThunk(
  'leaveTypes/fetchLeaveTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/view`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Attach the token
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch leave types');
    }
  }
);

// Update a leave type
export const updateLeaveType = createAsyncThunk(
  'leaveTypes/updateLeaveType',
  async ({ id, leaveTypeData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, leaveTypeData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update leave type');
    }
  }
);

export const fetchLeaveTypeById = createAsyncThunk(
    'leaveTypes/fetchLeaveTypeById',
    async (id, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_URL}/viewbyid/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Attach token
          },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch leave type');
      }
    }
  );
  

// Delete a leave type
export const deleteLeaveType = createAsyncThunk(
  'leaveTypes/deleteLeaveType',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete leave type');
    }
  }
);

// Initial State
const initialState = {
  leaveTypes: [],
  loading: false,
  success: null,
  error: null,
};

// LeaveType Slice
const leaveTypeSlice = createSlice({
  name: 'leaveTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create Leave Type
    builder.addCase(createLeaveType.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createLeaveType.fulfilled, (state, action) => {
      state.loading = false;
      state.success = 'Leave type created successfully';
      state.leaveTypes.push(action.payload);
    });
    builder.addCase(createLeaveType.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to create leave type';
    });

    // Fetch Leave Types
    builder.addCase(fetchLeaveTypes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLeaveTypes.fulfilled, (state, action) => {
      state.loading = false;
      state.leaveTypes = action.payload;
    });
    builder.addCase(fetchLeaveTypes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch leave types';
    });

    // Update Leave Type
    builder.addCase(updateLeaveType.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateLeaveType.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Leave type updated successfully';
      
        // Ensure leaveTypes is an array before updating it
        if (Array.isArray(state.leaveTypes)) {
          const index = state.leaveTypes.findIndex((type) => type._id === action.payload._id);
          if (index !== -1) {
            state.leaveTypes[index] = action.payload;
          }
        }
      });
      
    builder.addCase(updateLeaveType.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update leave type';
    });

    // Delete Leave Type
    builder.addCase(deleteLeaveType.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteLeaveType.fulfilled, (state, action) => {
      state.loading = false;
      state.leaveTypes = state.leaveTypes.filter((type) => type._id !== action.payload);
    });
    builder.addCase(deleteLeaveType.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to delete leave type';
    });

    builder.addCase(fetchLeaveTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(fetchLeaveTypeById.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypes = action.payload;  // Set the leave type data
      });
      builder.addCase(fetchLeaveTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch leave type';
      });
  },
});

// Export the reducer
export default leaveTypeSlice.reducer;
