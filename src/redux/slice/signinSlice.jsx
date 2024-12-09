// src/redux/slices/signinSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to handle API call
export const signUpUser = createAsyncThunk(
  "auth/signUpUser",
  async (formData, { rejectWithValue }) => {
    const apiUrl = "http://localhost:8080/auth/add";
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
      localStorage.setItem("Id", result.user._id);
      return result;
    } catch (error) {
      return rejectWithValue("Unable to sign up. Please try again later.");
    }
  }
);

const signinSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        // console.log(state.user, "state.user");
        state.message = "Sign up successful!";
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = signinSlice.actions;
export default signinSlice.reducer;
