import { RaffleNumbersDto } from "@/backend/context/sold-numbers/application/dto";

import { apiClient } from "@/lib/api";

export const GetSoldNumbersByRaffle = async (
  raffleId: string,
  serverSide: boolean
): Promise<RaffleNumbersDto> => {
  return apiClient.get<RaffleNumbersDto>(
    `/api/raffle/${raffleId}/sold-numbers`,
    undefined,
    {
      cache: "no-cache",
      serverSide,
    }
  );
};
