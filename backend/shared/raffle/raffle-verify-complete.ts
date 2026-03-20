import { RaffleStatus } from "@/app/generated/prisma/enums";

import prisma from "@/lib/prisma";

import { Company } from "@/backend/context/company/domain/entities/company.entity";

import { GetRaffleByIdUseCase } from "@/backend/context/raffle/application/use-case";

import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import { closeRaffle } from "@/backend/shared/utils/close-raffle";

export async function RaffleVerifyComplete(
  raffleId: string,
  company: Company
): Promise<void> {
  const raffleRepository = new PrismaRaffleRepository();
  const getRaffleByIdUseCase = new GetRaffleByIdUseCase(raffleRepository);

  const raffle = await getRaffleByIdUseCase.execute({
    raffleId,
    companyId: company.id,
  });

  if (raffle.status !== RaffleStatus.ACTIVE) return;

  const soldCount = await prisma.soldNumber.count({
    where: {
      raffleId,
      status: "SOLD",
    },
  });

  if (soldCount < raffle.totalNumbers) return;

  await closeRaffle({ raffle, company });
}
