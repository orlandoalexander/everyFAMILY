import { useMutation } from "@tanstack/react-query";
import api from "./api";
import { useContext } from "react";
import AuthContext from "../AuthContext";

const useUpdateProfile = () => {
    const { user } = useContext(AuthContext);

    const updateProfile = async (data) => {
        const payload = {
            first_name: data.firstName,
            last_name: data.lastName,
            local_authority: data.localAuthority,
            organisation: data.organisation,
            organisation_role: data.organisationRole
        };

        const response = await api.put(`/user/${user.id}`, payload);
        return response.data;
    };

    return useMutation({
        mutationFn: updateProfile
    });
};

export default useUpdateProfile;