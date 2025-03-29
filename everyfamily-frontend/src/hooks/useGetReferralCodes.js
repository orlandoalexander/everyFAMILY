import { useQuery } from "@tanstack/react-query";
import api from "./api";

const useGetReferralCodes = () => {
    const getReferralCodes = async () => {
        const response = await api.get("/referrals")
        return response.data;
    };

    return useQuery({
        queryKey: ["referrals"],
        queryFn: getReferralCodes,
    });
};

export default useGetReferralCodes;