import { Raffle, RaffleWinner } from "@/app/generated/prisma/client";
import { RaffleWinnerEntity } from "@/backend/context/raffle-winner/domain/entities/raffle-winner.entity";
import { mapRaffleToDomainEntity } from "@/backend/context/raffle/infrastructure/mappers/raffle.mapper";

type RaffleWinnerWithRaffle = RaffleWinner & {
  raffle?: Raffle;
};

export function mapRaffleWinnerToDomainEntity(
  prismaRaffleWinner: RaffleWinnerWithRaffle
): RaffleWinnerEntity {
  return {
    id: prismaRaffleWinner.id,
    position: prismaRaffleWinner.position,
    number: prismaRaffleWinner.number,
    name: prismaRaffleWinner.name,
    phone: prismaRaffleWinner.phone,
    email: prismaRaffleWinner.email,
    raffleId: prismaRaffleWinner.raffleId,
    raffle: prismaRaffleWinner.raffle
      ? mapRaffleToDomainEntity(prismaRaffleWinner.raffle)
      : undefined,
    createdAt: prismaRaffleWinner.createdAt,
  };
}
