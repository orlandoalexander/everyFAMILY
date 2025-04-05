import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

const useDeleteReferral = () => {
  const queryClient = useQueryClient();
  const deleteReferral = async (id) => {
    const response = await api.delete(`/referrals/${id}`);
    return response.data;
  };

  return useMutation({
    mutationFn: deleteReferral,

    onSuccess: () => {
      queryClient.invalidateQueries(["referrals"]);
    },

    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });
};

export default useDeleteReferral;
