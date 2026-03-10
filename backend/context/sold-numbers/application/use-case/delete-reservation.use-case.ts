import { SoldNumbersRepository } from "@/backend/context/sold-numbers/domain/repositories/sold-numbers.repository";

import { RaffleRepository } from "@/backend/context/raffle/domain/repositories/raffle.repository";

import { DeleteReservationDto } from "@/backend/context/sold-numbers/application/dto";

import { NotFoundError, ValidationError } from "@/backend/shared/errors";

export class DeleteReservationUseCase {
  constructor(
    private soldNumbersRepository: SoldNumbersRepository,
    private raffleRepository: RaffleRepository
  ) {}

  async execute(data: DeleteReservationDto) {
    const { raffleId, sessionId } = data;

    if (!raffleId) {
      throw new ValidationError("El id de la rifa es obligatorio");
    }

    if (!sessionId) {
      throw new ValidationError("La sesion es obligatoria");
    }

    const raffle = await this.raffleRepository.findById(raffleId);

    if (!raffle) {
      throw new NotFoundError("Rifa no encontrada");
    }

    return await this.soldNumbersRepository.deleteReserverdNumberBySession(
      raffleId,
      sessionId
    );
  }
}
