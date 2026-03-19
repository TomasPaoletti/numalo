import {
  DrawMethod,
  DrawTrigger,
  RaffleStatus,
} from "@/app/generated/prisma/enums";

import prisma from "@/lib/prisma";

import { Company } from "@/backend/context/company/domain/entities/company.entity";

import {
  GetRaffleByIdUseCase,
  UpdateRaffleUseCase,
} from "@/backend/context/raffle/application/use-case";

import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import { emailSendRaffleCompleted } from "@/backend/shared/emails/email-send-raffle-completed.email";

export async function RaffleVerifyComplete(
  raffleId: string,
  company: Company
): Promise<void> {
  const raffleRepository = new PrismaRaffleRepository();
  const getRaffleByIdUseCase = new GetRaffleByIdUseCase(raffleRepository);
  const updateRaffleUseCase = new UpdateRaffleUseCase(raffleRepository);

  const raffle = await getRaffleByIdUseCase.execute({
    raffleId,
    companyId: company.id,
  });

  if (raffle.drawTrigger !== DrawTrigger.VENDER_TODO) return;

  if (raffle.status !== RaffleStatus.ACTIVE) return;

  const soldCount = await prisma.soldNumber.count({
    where: {
      raffleId,
      status: "SOLD",
    },
  });

  if (soldCount < raffle.totalNumbers) return;

  let winnerData: {
    winnerNumber: number;
    winnerName: string | undefined;
    winnerEmail: string | undefined;
    winnerPhone: string | undefined;
  } | null = null;

  if (raffle.drawMethod === DrawMethod.ALEATORIO) {
    const winnerNumber = Math.floor(Math.random() * raffle.totalNumbers) + 1;

    const soldNumber = await prisma.soldNumber.findUnique({
      where: { raffleId_number: { raffleId, number: winnerNumber } },
      include: { payment: true },
    });

    winnerData = {
      winnerNumber,
      winnerName: soldNumber?.payment?.payerName ?? undefined,
      winnerEmail: soldNumber?.payment?.payerEmail ?? undefined,
      winnerPhone: soldNumber?.payment?.payerPhone ?? undefined,
    };
  }

  await updateRaffleUseCase.execute(raffleId, {
    status: RaffleStatus.FINISHED,
    finishedAt: new Date(),
    ...(winnerData && {
      winnerNumber: winnerData.winnerNumber,
      winnerName: winnerData.winnerName,
      winnerEmail: winnerData.winnerEmail,
      winnerPhone: winnerData.winnerPhone,
      drawnAt: new Date(),
    }),
  });

  await emailSendRaffleCompleted({
    company,
    raffle,
  });
}
