import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

const useUpdateResource = () => {
  const queryClient = useQueryClient();
  const updateResource = async (data) => {
    const response = await api.put(`/resources/${data.id}`, data);
    return response.data;
  };

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
    },
    mutationFn: updateResource,
  });
};

export default useUpdateResource;
