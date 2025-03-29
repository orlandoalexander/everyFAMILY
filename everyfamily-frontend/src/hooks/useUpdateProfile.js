import { useMutation } from "@tanstack/react-query";
import api from "./api";
import { useContext } from "react";
import AuthContext from "../AuthContext";

const useUpdateProfile = () => {
    const { user } = useContext(AuthContext);

    const updateProfile = async (data) => {
        const response = await api.put(`/user/${user.id}`, data);
        return response.data;
    };

    return useMutation({
        mutationFn: updateProfile
    });
};

export default useUpdateProfile;