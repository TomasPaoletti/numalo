import { Raffle } from "@/app/generated/prisma/client";

import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

export function mapRaffleToDomainEntity(prismaRaffle: Raffle): RaffleEntity {
  return {
    id: prismaRaffle.id,
    title: prismaRaffle.title,
    description: prismaRaffle.description,
    image: prismaRaffle.image,
    imagePublicId: prismaRaffle.imagePublicId,
    totalNumbers: prismaRaffle.totalNumbers,
    numberPrice: Number(prismaRaffle.numberPrice),
    hasQuantityDiscount: prismaRaffle.hasQuantityDiscount,
    drawMethod: prismaRaffle.drawMethod,
    drawDate: prismaRaffle.drawDate,
    drawTrigger: prismaRaffle.drawTrigger,
    status: prismaRaffle.status,
    winnerNumber: prismaRaffle.winnerNumber,
    winnerName: prismaRaffle.winnerName,
    winnerPhone: prismaRaffle.winnerPhone,
    winnerEmail: prismaRaffle.winnerEmail,
    drawnAt: prismaRaffle.drawnAt,
    companyId: prismaRaffle.companyId,
    createdAt: prismaRaffle.createdAt,
    updatedAt: prismaRaffle.updatedAt,
    publishedAt: prismaRaffle.publishedAt,
    finishedAt: prismaRaffle.finishedAt,
  };
}
