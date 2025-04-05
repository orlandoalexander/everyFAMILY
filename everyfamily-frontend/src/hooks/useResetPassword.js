import { useMutation } from "@tanstack/react-query";
import api from "./api";

const useResetPassword = () => {
  const resetPassword = async ({ email }) => {
    const response = await api.get(`/reset_password/${email}`);
    return response.data;
  };

  return useMutation({
    mutationFn: resetPassword,
  });
};

export default useResetPassword;
