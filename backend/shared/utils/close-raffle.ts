import { RaffleStatus } from "@/app/generated/prisma/enums";

import prisma from "@/lib/prisma";

import { DrawMethod } from "@/types";

import { Company } from "@/backend/context/company/domain/entities/company.entity";
import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

import { UpdateRaffleUseCase } from "@/backend/context/raffle/application/use-case";

import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import { emailSendRaffleCompleted } from "@/backend/shared/emails/email-send-raffle-completed.email";

async function closeRaffle({
  raffle,
  company,
}: {
  raffle: RaffleEntity;
  company: Company;
}) {
  const raffleRepository = new PrismaRaffleRepository();
  const updateRaffleUseCase = new UpdateRaffleUseCase(raffleRepository);

  let winnerData: {
    winnerNumber: number;
    winnerName: string | undefined;
    winnerEmail: string | undefined;
    winnerPhone: string | undefined;
  } | null = null;

  if (raffle.drawMethod === DrawMethod.ALEATORIO) {
    const winnerNumber = Math.floor(Math.random() * raffle.totalNumbers) + 1;

    const soldNumber = await prisma.soldNumber.findUnique({
      where: {
        raffleId_number: { raffleId: raffle.id, number: winnerNumber },
      },
      include: { payment: true },
    });

    winnerData = {
      winnerNumber,
      winnerName: soldNumber?.payment?.payerName ?? undefined,
      winnerEmail: soldNumber?.payment?.payerEmail ?? undefined,
      winnerPhone: soldNumber?.payment?.payerPhone ?? undefined,
    };

    console.log(
      `[Cron] Rifa "${raffle.title}" — ganador aleatorio: #${winnerNumber}`
    );
  }

  await updateRaffleUseCase.execute(raffle.id, {
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

export { closeRaffle };
