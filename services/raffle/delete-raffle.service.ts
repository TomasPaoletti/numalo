import { apiClient } from "@/lib/api";

export const DeleteRaffle = async (raffleId: string) => {
  return apiClient.delete<void>(`/api/raffle/${raffleId}`);
};
