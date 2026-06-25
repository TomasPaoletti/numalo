import { SoldNumbersEntity } from "@/backend/context/sold-numbers/domain/entities/sold-numbers.entity";

import { apiClient } from "@/lib/api";

export const GetPendingNumbersWithPayment = async (
  raffleId: string,
  serverSide: boolean
): Promise<SoldNumbersEntity[]> => {
  return apiClient.get<SoldNumbersEntity[]>(
    `/api/raffle/${raffleId}/sold-numbers/pending`,
    undefined,
    {
      cache: "no-cache",
      serverSide,
    }
  );
};
