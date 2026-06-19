import { RaffleStatus } from "@/app/generated/prisma/enums";

import prisma from "@/lib/prisma";

import { DrawMethod } from "@/types";

import { Company } from "@/backend/context/company/domain/entities/company.entity";
import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

import { UpdateRaffleUseCase } from "@/backend/context/raffle/application/use-case";

import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import { GetSoldNumbersWithPayment } from "@/backend/context/sold-numbers/application/use-case";
import { PrismaSoldNumberRepository } from "@/backend/context/sold-numbers/infrastructure/database/sold-numbers.prisma-repository";
import { emailSendRaffleCompleted } from "@/backend/shared/emails/email-send-raffle-completed.email";
import { ValidationError } from "@/backend/shared/errors";

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

async function closeRaffle({
  raffle,
  company,
}: {
  raffle: RaffleEntity;
  company: Company;
}) {
  const raffleRepository = new PrismaRaffleRepository();
  const updateRaffleUseCase = new UpdateRaffleUseCase(raffleRepository);
  const soldNumbersRepository = new PrismaSoldNumberRepository();
  const getSoldNumbersWithPayment = new GetSoldNumbersWithPayment(
    raffleRepository,
    soldNumbersRepository
  );

  if (raffle.drawMethod === DrawMethod.ALEATORIO) {
    const soldNumbers = await getSoldNumbersWithPayment.execute(raffle.id);

    if (soldNumbers.length === 0) {
      throw new ValidationError("No hay números vendidos para sortear");
    }

    if (soldNumbers.length < raffle.winnersCount) {
      throw new ValidationError(
        "No hay suficientes participantes para la cantidad de ganadores"
      );
    }

    const shuffled = shuffleArray(soldNumbers);

    const winners = shuffled.slice(0, raffle.winnersCount);

    await prisma.$transaction(
      winners.map((winner, index) =>
        prisma.raffleWinner.create({
          data: {
            position: index + 1,
            number: winner.number,
            name: winner.payment?.payerName,
            email: winner.payment?.payerEmail,
            phone: winner.payment?.payerPhone,
            raffle: {
              connect: { id: raffle.id },
            },
          },
        })
      )
    );
  }

  await updateRaffleUseCase.execute(raffle.id, {
    status: RaffleStatus.FINISHED,
    finishedAt: new Date(),
  });

  await emailSendRaffleCompleted({
    company,
    raffle,
  });
}

export { closeRaffle };
