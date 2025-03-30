import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

const useAddUserResources = () => {
    const queryClient = useQueryClient();

    const addUserResources = async (data) => {
        const response = await api.post("/user_resources", data);
        return response.data;
    };

    return useMutation({
        mutationFn: addUserResources,
        onSuccess: () => {
            queryClient.invalidateQueries(["user_resources"]);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};

export default useAddUserResources;
