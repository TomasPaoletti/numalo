import { RaffleNumbersDto } from "@/backend/context/sold-numbers/application/dto";

import { apiClient } from "@/lib/api";

export const GetSoldNumbersWithPayment = async (
  raffleId: string,
  serverSide: boolean
): Promise<RaffleNumbersDto> => {
  return apiClient.get<RaffleNumbersDto>(
    `/api/raffle/${raffleId}/sold-numbers/payment`,
    undefined,
    {
      cache: "no-cache",
      serverSide,
    }
  );
};
