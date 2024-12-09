// src/redux/slice/employeeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/employee/employees'; // Base URL for the employee API
const token = localStorage.getItem('authToken');

// Async thunks for API requests
export const addEmployee = createAsyncThunk(
  'employees/addEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/add`, employeeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An unknown error occurred.');
    }
  }
);

export const viewEmployee = createAsyncThunk(
  'employees/viewEmployee',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/view/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An unknown error occurred.');
    }
  }
);

export const viewAllEmployees = createAsyncThunk(
  'employees/viewAllEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/viewall/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An unknown error occurred.');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/delte/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An unknown error occurred.');
    }
  }
);

// Edit Employee
export const editEmployee = createAsyncThunk(
  'employees/editEmployee',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/edit/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An unknown error occurred.');
    }
  }
);

// Employee slice
const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    employee: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Employee
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees = action.payload.user;
        state.employeeProfile = action.payload.profile;
        state.loading = false;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // View Employee
      .addCase(viewEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(viewEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // View All Employees
      .addCase(viewAllEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(viewAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter((emp) => emp.id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit Employee
      .addCase(editEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex((emp) => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(editEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = employeeSlice.actions;
export default employeeSlice.reducer;
