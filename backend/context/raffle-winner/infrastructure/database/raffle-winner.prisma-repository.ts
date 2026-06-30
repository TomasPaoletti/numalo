import prisma from "@/lib/prisma";

import { RaffleWinnerEntity } from "@/backend/context/raffle-winner/domain/entities/raffle-winner.entity";
import { RaffleWinnerRepository } from "@/backend/context/raffle-winner/domain/repositories/raffle-winner.repository";
import { mapRaffleWinnerToDomainEntity } from "@/backend/context/raffle-winner/infrastructure/mappers/raffle-winner.mapper";

export class PrismaRaffleWinnerRepository implements RaffleWinnerRepository {
  async create(
    raffleWinnerData: Omit<RaffleWinnerEntity, "id" | "createdAt">
  ): Promise<RaffleWinnerEntity> {
    const prismaRaffleWinner = await prisma.raffleWinner.create({
      data: {
        position: raffleWinnerData.position,
        number: raffleWinnerData.number,
        name: raffleWinnerData.name,
        phone: raffleWinnerData.phone,
        email: raffleWinnerData.email,
        raffle: {
          connect: { id: raffleWinnerData.raffleId },
        },
      },
      include: {
        raffle: true,
      },
    });

    return mapRaffleWinnerToDomainEntity(prismaRaffleWinner);
  }
}
