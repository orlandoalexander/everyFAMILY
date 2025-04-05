import { useMutation } from "@tanstack/react-query";
import api from "./api";

const useUpdateReferral = () => {
  const updateReferral = async (data) => {
    const response = await api.put(`/referrals/${data.id}`, data);
    return response.data;
  };

  return useMutation({
    mutationFn: updateReferral,
  });
};

export default useUpdateReferral;
