import prisma from "@/lib/prisma";

import { RaffleStatus } from "@/app/generated/prisma/enums";

import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";
import { RaffleRepository } from "@/backend/context/raffle/domain/repositories/raffle.repository";
import { mapRaffleToDomainEntity } from "@/backend/context/raffle/infrastructure/mappers/raffle.mapper";

export class PrismaRaffleRepository implements RaffleRepository {
  async findById(id: string): Promise<RaffleEntity | null> {
    const prismaRaffle = await prisma.raffle.findUnique({
      where: { id },
    });

    if (!prismaRaffle) return null;

    return mapRaffleToDomainEntity(prismaRaffle);
  }

  async findByCompanyId(companyId: string): Promise<RaffleEntity[]> {
    const prismaRaffles = await prisma.raffle.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });

    return prismaRaffles.map(mapRaffleToDomainEntity);
  }

  async findByStatus(
    companyId: string,
    status: RaffleStatus
  ): Promise<RaffleEntity[]> {
    const prismaRaffles = await prisma.raffle.findMany({
      where: {
        companyId,
        status,
      },
      orderBy: { createdAt: "desc" },
    });

    return prismaRaffles.map(mapRaffleToDomainEntity);
  }

  async create(
    raffleData: Omit<RaffleEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<RaffleEntity> {
    const prismaRaffle = await prisma.raffle.create({
      data: {
        title: raffleData.title,
        description: raffleData.description,
        image: raffleData.image,
        totalNumbers: raffleData.totalNumbers,
        numberPrice: raffleData.numberPrice,
        hasQuantityDiscount: raffleData.hasQuantityDiscount,
        drawMethod: raffleData.drawMethod,
        drawDate: raffleData.drawDate,
        drawTrigger: raffleData.drawTrigger,
        status: raffleData.status,
        winnerNumber: raffleData.winnerNumber,
        winnerName: raffleData.winnerName,
        winnerPhone: raffleData.winnerPhone,
        winnerEmail: raffleData.winnerEmail,
        drawnAt: raffleData.drawnAt,
        publishedAt: raffleData.publishedAt,
        finishedAt: raffleData.finishedAt,
        companyId: raffleData.companyId,
      },
    });

    return mapRaffleToDomainEntity(prismaRaffle);
  }

  async update(
    id: string,
    updateData: Partial<Omit<RaffleEntity, "id" | "createdAt">>
  ): Promise<RaffleEntity> {
    const prismaRaffle = await prisma.raffle.update({
      where: { id },
      data: {
        ...(updateData.title && { title: updateData.title }),
        ...(updateData.description !== undefined && {
          description: updateData.description,
        }),
        ...(updateData.image !== undefined && { image: updateData.image }),
        ...(updateData.totalNumbers && {
          totalNumbers: updateData.totalNumbers,
        }),
        ...(updateData.numberPrice && { numberPrice: updateData.numberPrice }),
        ...(updateData.hasQuantityDiscount !== undefined && {
          hasQuantityDiscount: updateData.hasQuantityDiscount,
        }),
        ...(updateData.drawMethod && { drawMethod: updateData.drawMethod }),
        ...(updateData.drawDate !== undefined && {
          drawDate: updateData.drawDate,
        }),
        ...(updateData.drawTrigger && { drawTrigger: updateData.drawTrigger }),
        ...(updateData.status && { status: updateData.status }),
        ...(updateData.winnerNumber !== undefined && {
          winnerNumber: updateData.winnerNumber,
        }),
        ...(updateData.winnerName !== undefined && {
          winnerName: updateData.winnerName,
        }),
        ...(updateData.winnerPhone !== undefined && {
          winnerPhone: updateData.winnerPhone,
        }),
        ...(updateData.winnerEmail !== undefined && {
          winnerEmail: updateData.winnerEmail,
        }),
        ...(updateData.drawnAt !== undefined && {
          drawnAt: updateData.drawnAt,
        }),
        ...(updateData.publishedAt !== undefined && {
          publishedAt: updateData.publishedAt,
        }),
        ...(updateData.finishedAt !== undefined && {
          finishedAt: updateData.finishedAt,
        }),
        updatedAt: new Date(),
      },
    });

    return mapRaffleToDomainEntity(prismaRaffle);
  }

  async delete(id: string): Promise<void> {
    await prisma.raffle.delete({
      where: { id },
    });
  }
}
