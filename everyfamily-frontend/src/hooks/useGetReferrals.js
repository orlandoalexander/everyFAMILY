import { useQuery } from "@tanstack/react-query";
import api from "./api";

const useGetReferrals = () => {
  const getReferrals = async () => {
    const response = await api.get("/referrals");
    return response.data;
  };

  return useQuery({
    queryKey: ["referrals"],
    queryFn: getReferrals,
  });
};

export default useGetReferrals;
