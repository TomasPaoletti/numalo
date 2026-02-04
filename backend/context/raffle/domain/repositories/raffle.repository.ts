import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

export interface RaffleRepository {
  findById(id: string): Promise<RaffleEntity | null>;
  findAll(): Promise<RaffleEntity[]>;
  create(
    raffleData: Omit<RaffleEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<RaffleEntity>;
  update(
    id: string,
    updateData: Partial<Omit<RaffleEntity, "id" | "createdAt">>
  ): Promise<RaffleEntity>;
  delete(id: string): Promise<void>;
}
