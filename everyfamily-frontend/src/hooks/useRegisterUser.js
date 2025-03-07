import { useMutation } from "react-query";
import api from "./api";

const useCreateAccount = () => {
  const createAccount = async (data) => {
    return await api.post("/create_account", data);
  };

  return useMutation(createAccount, {
    onSuccess: (success) => {
      console.log(success);
    },
  });
};

export default useCreateAccount;
