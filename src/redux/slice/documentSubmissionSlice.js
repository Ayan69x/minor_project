import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base API URL (adjust this to match your backend API)
const API_URL = 'http://localhost:8080/api';
const token = localStorage.getItem('authToken');

// Thunk for submitting a document
export const submitDocument = createAsyncThunk(
  'documentSubmission/submitDocument',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/submit`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for fetching employee submissions
export const getEmployeeSubmissions = createAsyncThunk(
  'documentSubmission/getEmployeeSubmissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/employee/submissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for reviewing a document submission (HR/Admin)
export const reviewDocument = createAsyncThunk(
  'documentSubmission/reviewDocument',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/review`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for fetching all pending submissions (HR/Admin)
export const getAllPendingSubmissions = createAsyncThunk(
  'documentSubmission/getAllPendingSubmissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/hr/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for fetching submissions for a specific document request (HR/Admin)
export const getSubmissionsForDocumentRequest = createAsyncThunk(
  'documentSubmission/getSubmissionsForDocumentRequest',
  async (id, { rejectWithValue }) => {
    console.log(id);
    
    try {
      const response = await axios.get(`${API_URL}/hr/document/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for deleting a document submission (HR/Admin)
export const deleteSubmission = createAsyncThunk(
  'documentSubmission/deleteSubmission',
  async (submissionId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/hr/delete/${submissionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  submissions: [],
  pendingSubmissions: [],
  employeeSubmissions: [],
  loading: false,
  error: null,
};

// Slice
const documentSubmissionSlice = createSlice({
  name: 'documentSubmission',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Submit Document
    builder
      .addCase(submitDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions.push(action.payload);
      })
      .addCase(submitDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Employee Submissions
    builder
      .addCase(getEmployeeSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeSubmissions = action.payload;
      })
      .addCase(getEmployeeSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Review Document
    builder
      .addCase(reviewDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewDocument.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.submissions.findIndex(
          (submission) => submission._id === action.payload._id
        );
        if (index !== -1) {
          state.submissions[index] = action.payload;
        }
      })
      .addCase(reviewDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get All Pending Submissions
    builder
      .addCase(getAllPendingSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPendingSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingSubmissions = action.payload;
      })
      .addCase(getAllPendingSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Submissions for a Specific Document Request
    builder
      .addCase(getSubmissionsForDocumentRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubmissionsForDocumentRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(getSubmissionsForDocumentRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Submission
    builder
      .addCase(deleteSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = state.submissions.filter(
          (submission) => submission._id !== action.payload._id
        );
      })
      .addCase(deleteSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default documentSubmissionSlice.reducer;
