import { configureStore } from "@reduxjs/toolkit";
import departmentReducer from "./departmentSlice";
import employeeReducer from "./employeeSlice";

export const store = configureStore({
  reducer: {
    departments: departmentReducer,
    employees: employeeReducer,
  },
});
