import { ReservationStatus } from "@/app/generated/prisma/enums";

import prisma from "@/lib/prisma";

import { CreateReservationDto } from "@/backend/context/sold-numbers/application/dto";

import { SoldNumbersEntity } from "@/backend/context/sold-numbers/domain/entities/sold-numbers.entity";

import { SoldNumbersRepository } from "@/backend/context/sold-numbers/domain/repositories/sold-numbers.repository";

import { mapSoldNumberToDomainEntity } from "@/backend/context/sold-numbers/infrastructure/mappers/sold-number.mapper";

export class PrismaSoldNumberRepository implements SoldNumbersRepository {
  async create(
    soldNumberData: Omit<SoldNumbersEntity, "id">
  ): Promise<SoldNumbersEntity> {
    const prismaSoldNumbers = await prisma.soldNumber.create({
      data: {
        number: soldNumberData.number,
        paymentId: soldNumberData.paymentId,
        raffleId: soldNumberData.raffleId,
        reservedAt: soldNumberData.reservedAt,
        reservedBy: soldNumberData.reservedBy,
        reservedUntil: soldNumberData.reservedUntil,
        status: soldNumberData.status,
      },
    });

    return mapSoldNumberToDomainEntity(prismaSoldNumbers);
  }

  async findByRaffleId(raffleId: string): Promise<SoldNumbersEntity[]> {
    const soldNumbers = await prisma.soldNumber.findMany({
      where: { raffleId },
    });

    return soldNumbers.map(mapSoldNumberToDomainEntity);
  }

  async delete(id: string): Promise<void> {
    await prisma.soldNumber.delete({
      where: { id },
    });
  }

  async clearExpiredReservations(raffleId: string): Promise<void> {
    await prisma.soldNumber.deleteMany({
      where: {
        raffleId,
        status: ReservationStatus.RESERVED,
        reservedUntil: {
          lt: new Date(),
        },
      },
    });
  }

  async getUnavailableNumbers(
    raffleId: string,
    numbers: number[]
  ): Promise<number[]> {
    const existingNumbers = await prisma.soldNumber.findMany({
      where: {
        raffleId,
        number: { in: numbers },
        OR: [
          { status: "SOLD" },
          {
            status: ReservationStatus.RESERVED,
            reservedUntil: { gt: new Date() },
          },
        ],
      },
      select: { number: true },
    });

    return existingNumbers.map((n) => n.number);
  }

  async reserveNumbers(data: CreateReservationDto): Promise<void> {
    const { raffleId, numbers, sessionId, reservedUntil } = data;

    await prisma.soldNumber.createMany({
      data: numbers.map((number) => ({
        raffleId,
        number,
        status: ReservationStatus.RESERVED,
        reservedBy: sessionId,
        reservedAt: new Date(),
        reservedUntil,
      })),
    });
  }

  async getReservedNumbersBySession(
    raffleId: string,
    sessionId: string
  ): Promise<SoldNumbersEntity[]> {
    const reservedNumbers = await prisma.soldNumber.findMany({
      where: {
        raffleId,
        reservedBy: sessionId,
        status: ReservationStatus.RESERVED,
        reservedUntil: {
          gt: new Date(),
        },
      },
    });

    return reservedNumbers.map(mapSoldNumberToDomainEntity);
  }

  async findById(id: string): Promise<SoldNumbersEntity | null> {
    const soldNumber = await prisma.soldNumber.findUnique({
      where: { id },
    });

    if (!soldNumber) return null;

    return mapSoldNumberToDomainEntity(soldNumber);
  }

  async deleteReserverdNumberBySession(
    raffleId: string,
    sessionId: string
  ): Promise<void> {
    await prisma.soldNumber.deleteMany({
      where: {
        raffleId,
        reservedBy: sessionId,
        status: ReservationStatus.RESERVED,
      },
    });
  }
}
