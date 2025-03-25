import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

const useDeleteResource = () => {
    const queryClient = useQueryClient();

    const deleteResource = async (data) => {
        const response = await api.delete("/resources/${data}", data);
        return response.data;
    };

    return useMutation({
        mutationFn: deleteResource,
        onSuccess: () => {
            queryClient.invalidateQueries(["resources"]);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};

export default useDeleteResource;
