import { useMutation } from "@tanstack/react-query";
import api from "./api";
import { message } from "antd";

const useResetDemoDb = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/reset-db");
      return response.data;
    },
    onSuccess: () => {
      window.location.reload();
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || "Failed to reset demo database."
      );
    },
  });

  return mutation;
};

export default useResetDemoDb;
