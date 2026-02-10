import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

import { apiClient } from "@/lib/api";

export const GetRaffleById = async (
  raffleId: string,
  serverSide: boolean
): Promise<RaffleEntity> => {
  return apiClient.get<RaffleEntity>(`/api/raffle/${raffleId}`, undefined, {
    tags: [`raffle-${raffleId}`],
    serverSide,
  });
};
