import { useQuery } from "@tanstack/react-query";
import api from "./api";

const useGetResources = () => {
  const getResources = async () => {
    const response = await api.get("/resources");
    return response.data;
  };

  return useQuery({
    queryKey: ["resources"],
    queryFn: getResources,
  });
};

export default useGetResources;
