import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to handle API call for adding a user profile
export const addUserProfile = createAsyncThunk(
  "userProfile/addUserProfile",
  async (formData, { rejectWithValue }) => {
    const apiUrl = "http://localhost:8080/api/profiles"; // Adjust the API endpoint as needed
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.message);
      }
      return result; // Return the added profile data
    } catch (error) {
      return rejectWithValue("Unable to add profile. Please try again later.");
    }
  }
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: {
    userProfile: null, // Holds the added user profile information
    isLoading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearProfileMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(addUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
        state.message = "Profile added successfully!";
      })
      .addCase(addUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileMessage } = userProfileSlice.actions;
export default userProfileSlice.reducer;
