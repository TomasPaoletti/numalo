import { SoldNumbersEntity } from "@/backend/context/sold-numbers/domain/entities/sold-numbers.entity";

export interface SoldNumbersRepository {
  findByRaffleId(raffleId: string): Promise<SoldNumbersEntity[]>;
  create(
    soldNumberData: Omit<SoldNumbersEntity, "id">
  ): Promise<SoldNumbersEntity>;
  delete(id: string): Promise<void>;
}
