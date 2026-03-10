import { SoldNumbersRepository } from "@/backend/context/sold-numbers/domain/repositories/sold-numbers.repository";

import { RaffleRepository } from "@/backend/context/raffle/domain/repositories/raffle.repository";

import { GetReservationDto } from "@/backend/context/sold-numbers/application/dto";

import { NotFoundError } from "@/backend/shared/errors";

export class GetReservationUseCase {
  constructor(
    private soldNumbersRepository: SoldNumbersRepository,
    private raffleRepository: RaffleRepository
  ) {}

  async execute(data: GetReservationDto) {
    const { raffleId, sessionId } = data;

    const raffle = await this.raffleRepository.findById(raffleId);

    if (!raffle) {
      throw new NotFoundError("Rifa no encontrada");
    }

    await this.soldNumbersRepository.clearExpiredReservations(raffleId);

    const reservedNumbers =
      await this.soldNumbersRepository.getReservedNumbersBySession(
        raffleId,
        sessionId
      );

    if (reservedNumbers.length === 0) {
      return null;
    }

    const count = reservedNumbers.length;
    const basePrice = count * raffle.numberPrice;

    const applicableDiscount = raffle.quantityDiscounts
      ?.filter((d) => count >= d.quantity)
      .sort((a, b) => b.quantity - a.quantity)[0];

    const discountAmount = applicableDiscount
      ? (basePrice * applicableDiscount.percentage) / 100
      : 0;

    const firstReservation = await this.soldNumbersRepository.findById(
      reservedNumbers[0].id
    );

    return {
      numbers: reservedNumbers.map((r) => r.number),
      reservedUntil: firstReservation?.reservedUntil || new Date(),
      totalPrice: basePrice,
      discount: discountAmount,
      finalPrice: basePrice - discountAmount,
      raffleId: raffle.id,
    };
  }
}
