import axiosInstance from "./axiosConfig";

const DEPARTMENT_ENDPOINT = "/Departments";

export const departmentApi = {
  // Get all departments
  getAll: async () => {
    const response = await axiosInstance.get(DEPARTMENT_ENDPOINT);
    return response.data;
  },

  // Get department by ID
  getById: async (id) => {
    const response = await axiosInstance.get(`${DEPARTMENT_ENDPOINT}/${id}`);
    return response.data;
  },

  // Create new department
  create: async (department) => {
    const response = await axiosInstance.post(DEPARTMENT_ENDPOINT, department);
    return response.data;
  },

  // Update department
  update: async (id, department) => {
    const response = await axiosInstance.put(
      `${DEPARTMENT_ENDPOINT}/${id}`,
      department
    );
    return response.data;
  },

  // Delete department
  delete: async (id) => {
    const response = await axiosInstance.delete(`${DEPARTMENT_ENDPOINT}/${id}`);
    return response.data;
  },
};
