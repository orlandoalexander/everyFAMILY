import { useQuery } from "@tanstack/react-query";
import api from "./api";

const useGetCategories = () => {
  const getCategories = async () => {
    const response = await api.get("/categories");
    return response.data;
  };

  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};

export default useGetCategories;
