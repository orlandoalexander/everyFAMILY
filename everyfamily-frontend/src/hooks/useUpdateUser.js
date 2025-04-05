import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "./api";
import AuthContext from "../AuthContext";

const useUpdateUser = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const updateUser = async (data) => {
    const response = await api.put(`/users/${data?.id || user?.id}`, data);
    return response.data;
  };

  return useMutation({
    mutationFn: updateUser,
  });
};

export default useUpdateUser;
