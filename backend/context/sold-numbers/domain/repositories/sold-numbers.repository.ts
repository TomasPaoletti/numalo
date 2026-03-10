import { CreateReservationDto } from "@/backend/context/sold-numbers/application/dto";

import { SoldNumbersEntity } from "@/backend/context/sold-numbers/domain/entities/sold-numbers.entity";

export interface SoldNumbersRepository {
  findByRaffleId(raffleId: string): Promise<SoldNumbersEntity[]>;
  create(
    soldNumberData: Omit<SoldNumbersEntity, "id">
  ): Promise<SoldNumbersEntity>;
  delete(id: string): Promise<void>;
  clearExpiredReservations(raffleId: string): Promise<void>;
  getUnavailableNumbers(raffleId: string, numbers: number[]): Promise<number[]>;
  reserveNumbers(data: CreateReservationDto): Promise<void>;
  getReservedNumbersBySession(
    raffleId: string,
    sessionId: string
  ): Promise<SoldNumbersEntity[]>;
  findById(id: string): Promise<SoldNumbersEntity | null>;
  deleteReserverdNumberBySession(
    raffleId: string,
    sessionId: string
  ): Promise<void>;
}
