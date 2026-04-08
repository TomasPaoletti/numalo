import {
  QuantityDiscount,
  Raffle,
  RaffleWinner,
} from "@/app/generated/prisma/client";

import { mapQuantityDiscountToDomainEntity } from "@/backend/context/quantity-discount/infrastructure/mappers/quantity-discount.mapper";
import { mapRaffleWinnerToDomainEntity } from "@/backend/context/raffle-winner/infrastructure/mappers/raffle-winner.mapper";

import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

type RaffleWithDiscounts = Raffle & {
  quantityDiscounts?: QuantityDiscount[];
  winners?: RaffleWinner[];
};

export function mapRaffleToDomainEntity(
  prismaRaffle: RaffleWithDiscounts
): RaffleEntity {
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
    companyId: prismaRaffle.companyId,
    createdAt: prismaRaffle.createdAt,
    updatedAt: prismaRaffle.updatedAt,
    publishedAt: prismaRaffle.publishedAt,
    finishedAt: prismaRaffle.finishedAt,

    quantityDiscounts: prismaRaffle.quantityDiscounts
      ? prismaRaffle.quantityDiscounts.map(mapQuantityDiscountToDomainEntity)
      : undefined,
    winners: prismaRaffle.winners
      ? prismaRaffle.winners.map(mapRaffleWinnerToDomainEntity)
      : undefined,
  };
}
