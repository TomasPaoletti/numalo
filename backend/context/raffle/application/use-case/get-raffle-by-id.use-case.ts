import { GetRaffleByIdDto } from "@/backend/context/raffle/application/dto";
import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

import { RaffleRepository } from "@/backend/context/raffle/domain/repositories/raffle.repository";

import { NotFoundError, ValidationError } from "@/backend/shared/errors";
import { ForbiddenError } from "@/backend/shared/errors/custom-error";

export class GetRaffleByIdUseCase {
  constructor(private raffleRepository: RaffleRepository) {}

  async execute(data: GetRaffleByIdDto): Promise<RaffleEntity> {
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

    return raffle;
  }
}
