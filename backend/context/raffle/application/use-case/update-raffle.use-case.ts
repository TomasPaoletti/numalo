import { UpdateRaffleDto } from "@/backend/context/raffle/application/dto";

import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";
import { RaffleRepository } from "@/backend/context/raffle/domain/repositories/raffle.repository";

import { NotFoundError } from "@/backend/shared/errors";

export class UpdateRaffleUseCase {
  constructor(private raffleRepository: RaffleRepository) {}

  async execute(
    raffleId: string,
    data: UpdateRaffleDto
  ): Promise<RaffleEntity> {
    const existingRaffle = await this.raffleRepository.findById(raffleId);

    if (!existingRaffle) {
      throw new NotFoundError("Rifa no encontrada");
    }

    const updatedRaffle = await this.raffleRepository.update(raffleId, data);

    return updatedRaffle;
  }
}
