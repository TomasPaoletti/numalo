import { RaffleRepository } from "@/backend/context/raffle/domain/repositories/raffle.repository";
import { RaffleNumbersDto } from "@/backend/context/sold-numbers/application/dto";

import { SoldNumbersRepository } from "@/backend/context/sold-numbers/domain/repositories/sold-numbers.repository";

import { NotFoundError, ValidationError } from "@/backend/shared/errors";

export class GetRaffleNumbersUseCase {
  constructor(
    private raffleRepository: RaffleRepository,
    private soldNumbersRepository: SoldNumbersRepository
  ) {}

  async execute(raffleId: string): Promise<RaffleNumbersDto> {
    if (!raffleId) {
      throw new ValidationError("El ID de la rifa es requerido");
    }

    const raffle = await this.raffleRepository.findById(raffleId);

    if (!raffle) {
      throw new NotFoundError("Rifa no encontrada");
    }

    const soldNumbers =
      await this.soldNumbersRepository.findByRaffleId(raffleId);
    const soldNumbersList = soldNumbers.map((sn) => sn.number);

    return {
      id: raffle.id,
      title: raffle.title,
      totalNumbers: raffle.totalNumbers,
      numberPrice: raffle.numberPrice,
      quantityDiscounts: raffle.quantityDiscounts?.map((qd) => ({
        id: qd.id,
        quantity: qd.quantity,
        percentage: qd.percentage,
        raffleId: qd.raffleId,
        createdAt: qd.createdAt,
      })),
      soldNumbers: soldNumbersList,
    };
  }
}
