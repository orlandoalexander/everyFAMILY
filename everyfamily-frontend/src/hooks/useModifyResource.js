import { useMutation } from "@tanstack/react-query";
import api from "./api";

const useModifyResource = () => {
  const modifyResource = async (data) => {
    const response = await api.put(`/resources/${data.id}`, data);
    return response.data;
  };

  return useMutation({
    mutationFn: modifyResource,

    onError: (error) => {
      console.error(error);
    },
  });
};

export default useModifyResource;
