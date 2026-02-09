import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

export interface RaffleStats {
  numbersSold: number;
  moneyCollected: number;
}

export interface RaffleWithStats extends RaffleEntity {
  stats: RaffleStats;
}
