import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

const useUpdateResource = () => {
  const queryClient = useQueryClient();
  const updateResource = async (data) => {
    console.log(data)
    const response = await api.put(`/resources/${data.id}`, data);
    return response.data;
  };

  return useMutation({
    onSuccess: (success, data) => {
      const urlParams = new URLSearchParams(window.location.search);
      if (
        (urlParams.get("filter") === "featured" &&
          data.featured !== undefined) ||
        data.featured === undefined
      )
        queryClient.invalidateQueries(["resources"]);
    },
    mutationFn: updateResource,
  });
};

export default useUpdateResource;
