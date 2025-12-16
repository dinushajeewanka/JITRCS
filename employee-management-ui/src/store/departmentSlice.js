import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  departments: [],
  selectedDepartment: null,
  loading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    setDepartments: (state, action) => {
      state.departments = action.payload;
    },
    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addDepartment: (state, action) => {
      state.departments.push(action.payload);
    },
    updateDepartment: (state, action) => {
      const index = state.departments.findIndex(
        (dept) => dept.departmentId === action.payload.departmentId
      );
      if (index !== -1) {
        state.departments[index] = action.payload;
      }
    },
    removeDepartment: (state, action) => {
      state.departments = state.departments.filter(
        (dept) => dept.departmentId !== action.payload
      );
    },
  },
});

export const {
  setDepartments,
  setSelectedDepartment,
  setLoading,
  setError,
  addDepartment,
  updateDepartment,
  removeDepartment,
} = departmentSlice.actions;

export default departmentSlice.reducer;
