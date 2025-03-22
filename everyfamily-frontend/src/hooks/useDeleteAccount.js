import { useMutation } from "@tanstack/react-query";
import api from "./api";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

const useDeleteAccount = () => {
    const { logout } = useContext(AuthContext);

    const createAccount = async (data) => {
        const response = await api.delete("/delete_user", data);
        return response.data;
    };

    return useMutation(createAccount, {
        onSuccess: (data) => {
            const { id, role, remember } = data;
            if (!id || !role) throw new Error('Invalid response data');
            logout({ role, id, remember: remember ?? false });
        },
    });
};

export default useDeleteAccount;