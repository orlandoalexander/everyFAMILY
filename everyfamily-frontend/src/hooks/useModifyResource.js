import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

const useModifyResource = () => {
    const queryClient = useQueryClient();

    const modifyResource = async ({ resourceId, data }) => {
        const response = await api.put(`/resources/${resourceId}`, data);
        return response.data;
    };

    return useMutation({
        mutationFn: modifyResource,
        onSuccess: () => {
            queryClient.invalidateQueries(["resources"]);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};

export default useModifyResource;
