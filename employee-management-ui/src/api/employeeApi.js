import axiosInstance from "./axiosConfig";

const EMPLOYEE_ENDPOINT = "/Employees";

export const employeeApi = {
  // Get all employees
  getAll: async () => {
    const response = await axiosInstance.get(EMPLOYEE_ENDPOINT);
    return response.data;
  },

  // Get employee by ID
  getById: async (id) => {
    const response = await axiosInstance.get(`${EMPLOYEE_ENDPOINT}/${id}`);
    return response.data;
  },

  // Create new employee
  create: async (employee) => {
    const response = await axiosInstance.post(EMPLOYEE_ENDPOINT, employee);
    return response.data;
  },

  // Update employee
  update: async (id, employee) => {
    const response = await axiosInstance.put(
      `${EMPLOYEE_ENDPOINT}/${id}`,
      employee
    );
    return response.data;
  },

  // Delete employee
  delete: async (id) => {
    const response = await axiosInstance.delete(`${EMPLOYEE_ENDPOINT}/${id}`);
    return response.data;
  },
};
