import {
  GetRaffleByIdPublicDto,
  RafflePublic,
} from "@/backend/context/raffle/application/dto";

import { RaffleRepository } from "@/backend/context/raffle/domain/repositories/raffle.repository";
import { SoldNumbersRepository } from "@/backend/context/sold-numbers/domain/repositories/sold-numbers.repository";

import { NotFoundError, ValidationError } from "@/backend/shared/errors";

export class GetRaffleByIdPublicUseCase {
  constructor(
    private raffleRepository: RaffleRepository,
    private soldNumberRepository: SoldNumbersRepository
  ) {}

  async execute(data: GetRaffleByIdPublicDto): Promise<RafflePublic> {
    const { raffleId } = data;

    if (!raffleId) {
      throw new ValidationError("El ID de la rifa es requerido");
    }

    const raffle = await this.raffleRepository.findById(raffleId);

    if (!raffle) {
      throw new NotFoundError("Rifa no encontrada");
    }

    const soldNumbers =
      await this.soldNumberRepository.findByRaffleId(raffleId);

    const numbersSold = soldNumbers.length;

    return {
      ...raffle,
      numbersSold,
    };
  }
}
