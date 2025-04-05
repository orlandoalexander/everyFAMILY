import { useMutation } from "@tanstack/react-query";
import api from "./api";
import { useContext } from "react";
import AuthContext from "../AuthContext";
import { useNavigate } from "react-router-dom";

const useAddUser = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const addUser = async ({ email, password, referral_code }) => {
    const response = await api.post("/users", {
      email,
      password,
      referral_code,
    });

    return response.data;
  };

  return useMutation({
    mutationFn: addUser,
    onSuccess: (data) => {
      const { id, role } = data;
      login({ role, id, remember: true });
      navigate("/user_profile");
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default useAddUser;
