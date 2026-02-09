import { RaffleWithStats } from "@/backend/context/raffle/application/dto";

import { apiClient } from "@/lib/api";

export const GetRaffleStatsById = async (
  raffleId: string,
  serverSide: boolean
): Promise<RaffleWithStats> => {
  return apiClient.get<RaffleWithStats>(
    `/api/raffle/${raffleId}/stats`,
    undefined,
    {
      tags: [`raffle-stats-${raffleId}`],
      serverSide,
    }
  );
};
