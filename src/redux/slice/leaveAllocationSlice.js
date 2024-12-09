import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/allocation/allocations'; // Base URL for the API

// Get the token from local storage
const token = localStorage.getItem('authToken');

// Create Leave Allocation
export const createLeaveAllocation = createAsyncThunk(
  'leaveAllocations/createLeaveAllocation',
  async (allocationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/create`, allocationData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create leave allocation');
    }
  }
);

// View All Leave Allocations
export const viewLeaveAllocations = createAsyncThunk(
  'leaveAllocations/viewLeaveAllocations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/viewall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch leave allocations');
    }
  }
);

// View Leave Allocation by Employee ID
export const viewLeaveAllocationByEmployee = createAsyncThunk(
  'leaveAllocations/viewLeaveAllocationByEmployee',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch leave allocation for the employee');
    }
  }
);

// Update Leave Allocation
export const updateLeaveAllocation = createAsyncThunk(
  'leaveAllocations/updateLeaveAllocation',
  async ({ allocationId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${allocationId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update leave allocation');
    }
  }
);

// Delete Leave Allocation
export const deleteLeaveAllocation = createAsyncThunk(
  'leaveAllocations/deleteLeaveAllocation',
  async (allocationId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${allocationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete leave allocation');
    }
  }
);

// Initial state
const initialState = {
  leaveAllocations: [],
  loading: false,
  error: null,
  success: null,
};

// Leave Allocations Slice
const leaveAllocationsSlice = createSlice({
  name: 'leaveAllocations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create Leave Allocation
    builder.addCase(createLeaveAllocation.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(createLeaveAllocation.fulfilled, (state, action) => {
      state.loading = false;
      state.success = 'Leave allocation created successfully';
      state.leaveAllocations.push(action.payload); // Add the new allocation
    });
    builder.addCase(createLeaveAllocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to create leave allocation';
    });

    // View All Leave Allocations
    builder.addCase(viewLeaveAllocations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(viewLeaveAllocations.fulfilled, (state, action) => {
      state.loading = false;
      state.leaveAllocations = action.payload; // Populate the state with leave allocations
    });
    builder.addCase(viewLeaveAllocations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch leave allocations';
    });

    // View Leave Allocation by Employee
    builder.addCase(viewLeaveAllocationByEmployee.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(viewLeaveAllocationByEmployee.fulfilled, (state, action) => {
      state.loading = false;
      // Update the state with the employee's allocation (can be modified based on your needs)
      state.leaveAllocations = [action.payload];
    });
    builder.addCase(viewLeaveAllocationByEmployee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch employee leave allocation';
    });

    // Update Leave Allocation
    builder.addCase(updateLeaveAllocation.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(updateLeaveAllocation.fulfilled, (state, action) => {
      state.loading = false;
      state.success = 'Leave allocation updated successfully';
      const index = state.leaveAllocations.findIndex(
        (allocation) => allocation._id === action.payload._id
      );
      if (index !== -1) {
        state.leaveAllocations[index] = action.payload; // Update the allocation
      }
    });
    builder.addCase(updateLeaveAllocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update leave allocation';
    });

    // Delete Leave Allocation
    builder.addCase(deleteLeaveAllocation.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteLeaveAllocation.fulfilled, (state, action) => {
      state.loading = false;
      state.success = 'Leave allocation deleted successfully';
      state.leaveAllocations = state.leaveAllocations.filter(
        (allocation) => allocation._id !== action.meta.arg
      );
    });
    builder.addCase(deleteLeaveAllocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to delete leave allocation';
    });
  },
});

// Export the reducer to be added to the store
export default leaveAllocationsSlice.reducer;
