// src/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/user/users'; // Base URL for user API

// Helper function to decode JWT token
const getUserIdFromToken = (token) => {
  try {
    // Split the token into its parts: header, payload, and signature
    const tokenParts = token.split('.');

    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode the payload (second part of the token)
    const decodedPayload = JSON.parse(atob(tokenParts[1]));

    // Return the userId from the payload (adjust based on your token structure)
    return decodedPayload.id; // Adjust the key based on your API
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Thunks for API calls

// Fetch Users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return rejectWithValue(error.response?.data || 'Error fetching users');
    }
  }
);

// Add User
export const addUser = createAsyncThunk('user/add', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/add`, userData);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    return rejectWithValue(error.response?.data || 'Error adding user');
  }
});

// Login User
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        const userId = getUserIdFromToken(response.data.token); // Use response token instead of old token
        // // console.log('User ID:', userId); 
        localStorage.setItem('userId', userId);
      }
      
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
      return rejectWithValue(error.response?.data || 'Error logging in');
    }
  }
);

// Update User
export const updateUser = createAsyncThunk('user/update', async ({ id, userData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    return rejectWithValue(error.response?.data || 'Error updating user');
  }
});

// Delete User
export const deleteUser = createAsyncThunk('user/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return { id }; // Returning the deleted user id
  } catch (error) {
    console.error('Error deleting user:', error);
    return rejectWithValue(error.response?.data || 'Error deleting user');
  }
});

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    list: [],
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Logout action to clear local storage and reset the state
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
    },
    // Action to clear error state
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on new fetch
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add User
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload; // Save the logged-in user data
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((user) => user.id === action.payload.id);
        if (index >= 0) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((user) => user.id !== action.payload.id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
