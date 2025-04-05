import { useQuery } from "@tanstack/react-query";
import api from "./api";

const useGetUsers = (user_id) => {
  const getUsers = async () => {
    const response = await api.get(user_id ? `/users/${user_id}` : "/users");
    return response.data;
  };

  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

export default useGetUsers;
