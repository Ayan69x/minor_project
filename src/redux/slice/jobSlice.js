// src/redux/slices/jobSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import getUserRoleFromToken from '../../components/Role';

const API_URL = 'http://localhost:8080/job/job'; // Base URL for job API

const token = localStorage.getItem('authToken'); // Get the token from local storage
const role = token ? getUserRoleFromToken(token) : null; // Decode and get the role

// Fetch jobs - accessible to everyone
export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/list`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token to the Authorization header 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return rejectWithValue(error.response?.data || 'Error fetching jobs');
  }
});

// Post a new job - only accessible to admins
export const postJob = createAsyncThunk('jobs/postJob', async (formData, { rejectWithValue }) => {
  if (role !== 'admin' || role !== 'super_admin') {
    return rejectWithValue('Only admins can post jobs');
  }

  try {
    const response = await axios.post(`${API_URL}/post`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response);
    
    return response.data;
  } catch (error) {
    console.error('Error posting job:', error);
    return rejectWithValue(error.response?.data || 'Error posting job');
  }
});

// Update a job - only accessible to admins
export const updateJob = createAsyncThunk('jobs/updateJob', async ({ id, formData }, { rejectWithValue }) => {
  if (role !== 'admin') {
    return rejectWithValue('Only admins can update jobs');
  }

  try {
    const response = await axios.put(`${API_URL}/update/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating job:', error);
    return rejectWithValue(error.response?.data || 'Error updating job');
  }
});

// Delete a job - only accessible to admins
export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id, { rejectWithValue }) => {
  if (role !== 'admin') {
    return rejectWithValue('Only admins can delete jobs');
  }

  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return id; // Return the id so we can remove the job from the state
  } catch (error) {
    console.error('Error deleting job:', error);
    return rejectWithValue(error.response?.data || 'Error deleting job');
  }
});

// Job Slice
const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch jobs
    builder.addCase(fetchJobs.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchJobs.fulfilled, (state, action) => {
      state.loading = false;
      state.jobs = action.payload;
    })
    .addCase(fetchJobs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });
  
    // Post job
    builder.addCase(postJob.pending, (state) => {
      state.loading = true;
    })
    .addCase(postJob.fulfilled, (state, action) => {
      state.loading = false;
      state.jobs.push(action.payload); // Add new job
    })
    .addCase(postJob.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });
  
    // Update job
    builder.addCase(updateJob.pending, (state) => {
      state.loading = true;
    })
    .addCase(updateJob.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.jobs.findIndex(job => job.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = action.payload; // Update job
      }
    })
    .addCase(updateJob.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });
  
    // Delete job
    builder.addCase(deleteJob.pending, (state) => {
      state.loading = true;
    })
    .addCase(deleteJob.fulfilled, (state, action) => {
      state.loading = false;
      state.jobs = state.jobs.filter(job => job.id !== action.payload); // Remove deleted job
    })
    .addCase(deleteJob.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });
  },
});

export default jobSlice.reducer;

