import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "./api";
import AuthContext from "../AuthContext";

const useDeleteAccount = () => {
  const { logout } = useContext(AuthContext);

  const deleteAccount = async (id) => {
    const response = await api.delete(`/user/${id}`); // Pass user_id in URL
    return response.data;
  };

  return useMutation({
    mutationFn: deleteAccount, // Correct way to define mutation
    onSuccess: () => {
      console.log("User deleted successfully");
      logout();
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });
};

export default useDeleteAccount;
