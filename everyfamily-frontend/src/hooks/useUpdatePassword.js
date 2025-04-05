import { useMutation } from "@tanstack/react-query";
import api from "./api";

const useUpdatePassword = () => {
  const updatePassword = async (data) => {
    const response = await api.put("change_password", data);
    return response.data;
  };

  return useMutation({
    mutationFn: updatePassword,
  });
};

export default useUpdatePassword;
