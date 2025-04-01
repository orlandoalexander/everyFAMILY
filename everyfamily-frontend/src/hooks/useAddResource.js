import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

const useAddResource = () => {
  const queryClient = useQueryClient();

  const addResource = async (data) => {
    const response = await api.post("/resources", data);
    return response.data;
  };

  return useMutation({
    mutationFn: addResource,
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default useAddResource;
