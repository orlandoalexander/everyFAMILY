import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  };

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },

    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });
};

export default useDeleteUser;
