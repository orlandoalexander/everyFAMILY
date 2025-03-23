import { useMutation } from "@tanstack/react-query";
import api from "./api";

const useForgotPassword = () => {
    const forgotPassword = async (data) => {
        const { email } = data;
        const response = await api.post("/forgot-password", { email });
        return response.data;
    };

    return useMutation({
        mutationFn: forgotPassword,
    });
};

export default useForgotPassword;