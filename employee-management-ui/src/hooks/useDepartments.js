import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentApi } from "../api/departmentApi";
import { useDispatch } from "react-redux";
import { setDepartments, setLoading, setError } from "../store/departmentSlice";

export const useDepartments = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      dispatch(setLoading(true));
      try {
        const data = await departmentApi.getAll();
        dispatch(setDepartments(data));
        dispatch(setError(null));
        return data;
      } catch (error) {
        dispatch(setError(error.message));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: departmentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => departmentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: departmentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
    },
  });

  return {
    departments: departmentsQuery.data || [],
    isLoading: departmentsQuery.isLoading,
    error: departmentsQuery.error,
    createDepartment: createMutation.mutate,
    updateDepartment: updateMutation.mutate,
    deleteDepartment: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
