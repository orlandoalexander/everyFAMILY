import { useMutation } from "@tanstack/react-query";
import api from "./api";
import { useContext } from "react";
import AuthContext from "../AuthContext";

const useCreateAccount = () => {
  const { login } = useContext(AuthContext);

  const createAccount = async (data) => {
    const response = await api.post("/user", data);
    return response.data;
  };

  return useMutation({
    mutationFn: createAccount,
    onSuccess: (data) => {
      const { id, role, remember } = data;
      if (!id || !role) throw new Error("Invalid response data");
      login({ role, id, remember: remember ?? false });
    },
  });
};

export default useCreateAccount;
