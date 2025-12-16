import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  error: null,
  filters: {
    searchTerm: "",
    departmentId: null,
  },
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addEmployee: (state, action) => {
      state.employees.push(action.payload);
    },
    updateEmployee: (state, action) => {
      const index = state.employees.findIndex(
        (emp) => emp.employeeId === action.payload.employeeId
      );
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    removeEmployee: (state, action) => {
      state.employees = state.employees.filter(
        (emp) => emp.employeeId !== action.payload
      );
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const {
  setEmployees,
  setSelectedEmployee,
  setLoading,
  setError,
  addEmployee,
  updateEmployee,
  removeEmployee,
  setFilters,
} = employeeSlice.actions;

export default employeeSlice.reducer;
