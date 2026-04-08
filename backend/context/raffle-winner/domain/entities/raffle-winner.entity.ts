import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

export interface RaffleWinnerEntity {
  id: string;
  position: number;
  number: number;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  raffleId: string;
  raffle?: RaffleEntity;
  createdAt: Date;
}
