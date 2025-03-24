import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import AuthContext from "../AuthContext";
import api from "./api";

const useGetResources = () => {
  const { user } = useContext(AuthContext);

  const getResources = async () => {
    const response = await api.get(`/resources?user_id=${user.id}`);
    return response.data;
  };

  return useQuery({
    queryKey: ["resources"],
    queryFn: getResources,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    keepPreviousData: true,
  });
};

export default useGetResources;
