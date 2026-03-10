import { CreateReservationDto } from "@/backend/context/sold-numbers/application/dto";

import { SoldNumbersRepository } from "@/backend/context/sold-numbers/domain/repositories/sold-numbers.repository";

import { ValidationError } from "@/backend/shared/errors";

export class CreateReservationUseCase {
  constructor(private soldNumbersRepository: SoldNumbersRepository) {}

  async execute(data: CreateReservationDto) {
    const { raffleId, numbers, sessionId } = data;

    if (numbers.length === 0) {
      throw new ValidationError("Debes seleccionar al menos un número");
    }

    await this.soldNumbersRepository.clearExpiredReservations(raffleId);

    const unavailable = await this.soldNumbersRepository.getUnavailableNumbers(
      raffleId,
      numbers
    );

    if (unavailable.length > 0) {
      throw new ValidationError(
        `Los números "${unavailable.join(", ")}" ya no están disponibles`
      );
    }

    const reservedUntil = new Date(Date.now() + 5 * 60 * 1000);

    await this.soldNumbersRepository.reserveNumbers({
      raffleId,
      numbers,
      sessionId,
      reservedUntil,
    });

    return {
      success: true,
      reservedUntil,
    };
  }
}
