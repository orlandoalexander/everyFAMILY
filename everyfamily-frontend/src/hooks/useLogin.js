import { useMutation } from "@tanstack/react-query";
import api from "./api";
import { useContext } from "react";
import AuthContext from "../AuthContext";

const useLogin = () => {
    const { login } = useContext(AuthContext);

    const loginUser = async (data) => {
        const { email, password, remember = false } = data;

        const response = await api.post("/login", { email, password });

        return {
            ...response.data,
            remember
        };
    };

    return useMutation({
        mutationFn: loginUser,
        onSuccess: ({ id, role, remember }) => {
            login({ role, id, remember });
        }
    });
};

export default useLogin;