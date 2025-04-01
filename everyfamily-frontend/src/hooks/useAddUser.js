import { useMutation } from "@tanstack/react-query";
import api from "./api";
import { useContext } from "react";
import AuthContext from "../AuthContext";
import { useNavigate } from "react-router-dom";

const useAddUser = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const addUser = async ({ email, password, referralCode, remember }) => {
    const payload = {
      email,
      password,
      referral_code: referralCode,
    };
    const { data } = await api.post("/users", payload);

    return { ...data, remember };
  };

  return useMutation({
    mutationFn: addUser,
    onSuccess: (data) => {
      console.log(data);
      const { id, role, remember } = data;
      login({ role, id, remember: remember ?? false });
      navigate("/complete_profile");
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default useAddUser;
