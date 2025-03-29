import { useQuery } from "@tanstack/react-query";
import api from "./api";

const useGetUsers = () => {
    const getUsers = async () => {
        const response = await api.get("/users")
        return response.data;
    };

    return useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });
};

export default useGetUsers;