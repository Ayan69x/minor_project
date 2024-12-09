import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for making the organization setup API call
export const setupOrganization = createAsyncThunk(
  'organization/setupOrganization',
  async (formData, { rejectWithValue }) => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // API call
      const response = await fetch('http://localhost:8080/auth/addOrganization', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      return result; // Return the result on success
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors
    }
  }
);

export const fetchOrganizationById = createAsyncThunk(
  'organization/fetchOrganizationById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/auth/addOrganization/view/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch organization details');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const organizationSlice = createSlice({
  name: 'organization',
  initialState: {
    org:[],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    message: '',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setupOrganization.pending, (state) => {
        state.status = 'loading';
        state.message = '';
        state.error = null;
      })
      .addCase(setupOrganization.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = 'Organization setup successful!';
        state.org = action.payload;
      })
      .addCase(setupOrganization.rejected, (state, action) => {
        state.status = 'failed';
        state.message = '';
        state.error = action.payload || 'Failed to setup organization';
      });
      builder
      .addCase(fetchOrganizationById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrganizationById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.org = action.payload; // Store fetched organization
      })
      .addCase(fetchOrganizationById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch organization';
      });
  },
});

export default organizationSlice.reducer;
