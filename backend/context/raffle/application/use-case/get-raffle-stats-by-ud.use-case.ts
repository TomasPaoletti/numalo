import {
  GetRaffleByIdDto,
  RaffleWithStats,
} from "@/backend/context/raffle/application/dto";

import { RaffleRepository } from "@/backend/context/raffle/domain/repositories/raffle.repository";
import { SoldNumbersRepository } from "@/backend/context/sold-numbers/domain/repositories/sold-numbers.repository";

import { NotFoundError, ValidationError } from "@/backend/shared/errors";
import { ForbiddenError } from "@/backend/shared/errors/custom-error";

export class GetRaffleStatsByIdUseCase {
  constructor(
    private raffleRepository: RaffleRepository,
    private soldNumberRepository: SoldNumbersRepository
  ) {}

  async execute(data: GetRaffleByIdDto): Promise<RaffleWithStats> {
    const { raffleId, companyId } = data;

    if (!raffleId) {
      throw new ValidationError("El ID de la rifa es requerido");
    }

    const raffle = await this.raffleRepository.findById(raffleId);

    if (!raffle) {
      throw new NotFoundError("Rifa no encontrada");
    }

    if (raffle.companyId !== companyId) {
      throw new ForbiddenError("No tienes permisos para ver esta rifa");
    }

    const soldNumbers =
      await this.soldNumberRepository.findByRaffleId(raffleId);

    const numbersSold = soldNumbers.length;

    const moneyCollected = numbersSold * raffle.numberPrice;

    return {
      ...raffle,
      stats: {
        numbersSold,
        moneyCollected,
      },
    };
  }
}
