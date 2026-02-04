import { RaffleStatus } from "@/app/generated/prisma/enums";
import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

import { apiClient } from "@/lib/api";

const GetRaffles = async (
  serverSide: boolean,
  status?: RaffleStatus
): Promise<RaffleEntity[]> => {
  const params = status ? { status } : undefined;
  return apiClient.get<RaffleEntity[]>("/api/raffle", params, {
    tags: ["raffles"],
    serverSide,
  });
};

export default GetRaffles;
