import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async actions using createAsyncThunk
const token = localStorage.getItem('authToken');
// Create a new document request
export const createDocumentRequest = createAsyncThunk(
  "documentRequest/create",
  async (requestData, thunkAPI) => {
   // Fetch token inside thunk
    try {
      const response = await axios.post(
        "http://localhost:8080/api/create",
        requestData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in createDocumentRequest: ", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get all document requests for the logged-in employee
export const getEmployeeDocumentRequests = createAsyncThunk(
  "documentRequest/getEmployeeRequests",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/employee/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in getEmployeeDocumentRequests: ", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update a document request
export const updateDocumentRequest = createAsyncThunk(
  "documentRequest/update",
  async ({ id, updateData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/update/${id}`,
        updateData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in updateDocumentRequest: ", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a document request
export const deleteDocumentRequest = createAsyncThunk(
  "documentRequest/delete",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in deleteDocumentRequest: ", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Employee submits a document
export const submitDocument = createAsyncThunk(
  "documentRequest/submit",
  async ({ documentRequestId, file }, thunkAPI) => {
    const formData = new FormData();
    formData.append("file", file);

    console.log("Submitting file: ", file.name, file.size, file.type);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/submit/${documentRequestId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in submitDocument: ", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get all document requests for HR/Admin
export const getAllDocumentRequests = createAsyncThunk(
  "documentRequest/getAllRequests",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:8080/api/hr/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getAllDocumentRequests: ", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get all pending document submissions for HR/Admin to review
export const getSubmissionsForReview = createAsyncThunk(
  "documentRequest/getSubmissionsForReview",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/hr/submissions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in getSubmissionsForReview: ", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Review a submission (approve or reject)
export const reviewSubmission = createAsyncThunk(
  "documentRequest/reviewSubmission",
  async ({ id, reviewData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/hr/review/${id}`,
        reviewData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in reviewSubmission: ", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const documentRequestSlice = createSlice({
  name: "documentRequest",
  initialState: {
    requests: [],
    submissions: [], // For HR/Admin to review
    status: "idle", // idle, loading, succeeded, failed
    error: null,
    loading: false, // Loading state for file submission
  },
  reducers: {
    // Optionally, add non-async reducers here
  },
  extraReducers: (builder) => {
    builder
      // Create document request
      .addCase(createDocumentRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDocumentRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requests.push(action.payload); // Add the new document request
      })
      .addCase(createDocumentRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Get employee document requests
      .addCase(getEmployeeDocumentRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getEmployeeDocumentRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requests = action.payload; // Replace with the employee's document requests
      })
      .addCase(getEmployeeDocumentRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update document request
      .addCase(updateDocumentRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateDocumentRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.requests.findIndex(
          (req) => req._id === action.payload._id
        );
        if (index !== -1) {
          state.requests[index] = action.payload; // Update the document request
        }
      })
      .addCase(updateDocumentRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete document request
      .addCase(deleteDocumentRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteDocumentRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requests = state.requests.filter(
          (req) => req._id !== action.payload._id
        ); // Remove deleted request
      })
      .addCase(deleteDocumentRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Submit document
      .addCase(submitDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitDocument.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(submitDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get all document requests for HR/Admin
      .addCase(getAllDocumentRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllDocumentRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requests = action.payload; // Replace with all document requests for HR/Admin
      })
      .addCase(getAllDocumentRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Get submissions for review
      .addCase(getSubmissionsForReview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSubmissionsForReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.submissions = action.payload; // Replace with pending submissions
      })
      .addCase(getSubmissionsForReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Review submission
      .addCase(reviewSubmission.pending, (state) => {
        state.status = "loading";
      })
      .addCase(reviewSubmission.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.submissions.findIndex(
          (submission) => submission._id === action.payload._id
        );
        if (index !== -1) {
          state.submissions[index] = action.payload; // Update the submission status
        }
      })
      .addCase(reviewSubmission.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export the reducer to be used in the store
export default documentRequestSlice.reducer;
