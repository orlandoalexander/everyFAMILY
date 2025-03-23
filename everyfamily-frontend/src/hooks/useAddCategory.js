import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

const useAddCatgegory = () => {
  const queryClient = useQueryClient();

  const addCatgegory = async (data) => {
    const response = await api.post("/categories", data);
    return response.data;
  };

  return useMutation({
    mutationFn: addCatgegory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default useAddCatgegory;
