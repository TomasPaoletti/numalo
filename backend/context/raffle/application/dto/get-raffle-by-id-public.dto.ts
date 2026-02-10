import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

export interface GetRaffleByIdPublicDto {
  raffleId: string;
}

export interface RafflePublic extends RaffleEntity {
  numbersSold: number;
}
