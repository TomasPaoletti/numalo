import { RaffleRepository } from "@/backend/context/raffle/domain/repositories/raffle.repository";
import { SoldNumbersEntity } from "@/backend/context/sold-numbers/domain/entities/sold-numbers.entity";

import { SoldNumbersRepository } from "@/backend/context/sold-numbers/domain/repositories/sold-numbers.repository";

import { NotFoundError, ValidationError } from "@/backend/shared/errors";

export class GetSoldNumbersWithPayment {
  constructor(
    private raffleRepository: RaffleRepository,
    private soldNumbersRepository: SoldNumbersRepository
  ) {}

  async execute(raffleId: string): Promise<SoldNumbersEntity[]> {
    if (!raffleId) {
      throw new ValidationError("El ID de la rifa es requerido");
    }

    const raffle = await this.raffleRepository.findById(raffleId);

    if (!raffle) {
      throw new NotFoundError("Rifa no encontrada");
    }

    return this.soldNumbersRepository.getSoldNumbersWithPayment(raffleId);
  }
}
