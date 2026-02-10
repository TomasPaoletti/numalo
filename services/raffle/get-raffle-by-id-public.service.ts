import { RafflePublic } from "@/backend/context/raffle/application/dto";

import { apiClient } from "@/lib/api";

export const GetRaffleByIdPublic = async (
  raffleId: string,
  serverSide: boolean
): Promise<RafflePublic> => {
  return apiClient.get<RafflePublic>(
    `/api/raffle/${raffleId}/public`,
    undefined,
    {
      tags: [`raffle-public-${raffleId}`],
      serverSide,
    }
  );
};
