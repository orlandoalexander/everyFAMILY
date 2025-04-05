import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

const useAddReferral = () => {
  const queryClient = useQueryClient();

  const addReferral = async () => {
    const response = await api.post("/referrals");
    return response.data;
  };

  return useMutation({
    mutationFn: addReferral,
    onSuccess: () => {
      queryClient.invalidateQueries(["referrals"]);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default useAddReferral;
