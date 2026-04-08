import { RaffleWinnerEntity } from "@/backend/context/raffle-winner/domain/entities/raffle-winner.entity";

export interface RaffleWinnerRepository {
  create(
    raffleWinnerData: Omit<RaffleWinnerEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<RaffleWinnerEntity>;
}
