import { useQuery } from "@tanstack/react-query";
import api from "./api";

const useGetCategories = () => {
  const getCategories = async () => {
    const response = await api.get("/types");
    return response.data;
  };

  return useQuery({
    queryKey: ["types"],
    queryFn: getCategories,
  });
};

export default useGetCategories;
