import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

const useAddType = () => {
  const queryClient = useQueryClient();

  const addType = async (data) => {
    const response = await api.post("/resources", data);
    return response.data;
  };

  return useMutation({
    mutationFn: addType,
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default useAddType;
