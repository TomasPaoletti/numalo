import { SoldNumbersEntity } from "@/backend/context/sold-numbers/domain/entities/sold-numbers.entity";

import { apiClient } from "@/lib/api";

export const GetSoldNumbersWithPayment = async (
  raffleId: string,
  serverSide: boolean
): Promise<SoldNumbersEntity[]> => {
  return apiClient.get<SoldNumbersEntity[]>(
    `/api/raffle/${raffleId}/sold-numbers/payment`,
    undefined,
    {
      cache: "no-cache",
      serverSide,
    }
  );
};
