import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

import { DrawMethod, RaffleStatus } from "@/app/generated/prisma/enums";

import { UpdateRaffleUseCase } from "@/backend/context/raffle/application/use-case";
import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import { getQuinielaNumber } from "@/backend/shared/utils/get-quiniela-number";
import { getTodayArgentina } from "@/backend/shared/utils/yesterday-argentina";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const winnerNumber = await getQuinielaNumber();

    if (!winnerNumber) {
      console.log("[Cron Quiniela] Número no disponible todavía");
      return NextResponse.json(
        { error: "Número no disponible" },
        { status: 200 }
      );
    }

    const { start, end } = getTodayArgentina();

    const raffles = await prisma.raffle.findMany({
      where: {
        status: RaffleStatus.FINISHED,
        drawMethod: DrawMethod.QUINIELA_NACIONAL,
        finishedAt: { gte: start, lte: end },
        winnerNumber: null,
      },
    });

    if (raffles.length === 0) {
      return NextResponse.json({ updated: 0 });
    }

    const raffleRepository = new PrismaRaffleRepository();
    const updateRaffleUseCase = new UpdateRaffleUseCase(raffleRepository);

    const results = await Promise.allSettled(
      raffles.map(async (raffle) => {
        const mappedNumber = mapQuinielaToRaffleNumber(
          winnerNumber,
          raffle.totalNumbers
        );

        const soldNumber = await prisma.soldNumber.findUnique({
          where: {
            raffleId_number: { raffleId: raffle.id, number: mappedNumber },
          },
          include: { payment: true },
        });

        await updateRaffleUseCase.execute(raffle.id, {
          winnerNumber: mappedNumber,
          winnerName: soldNumber?.payment?.payerName ?? undefined,
          winnerEmail: soldNumber?.payment?.payerEmail ?? undefined,
          winnerPhone: soldNumber?.payment?.payerPhone ?? undefined,
          drawnAt: new Date(),
        });
      })
    );

    const failed = results.filter((r) => r.status === "rejected");

    return NextResponse.json({
      winnerNumber,
      updated: raffles.length - failed.length,
      failed: failed.length,
    });
  } catch (error) {
    console.error("[Cron Quiniela] Error inesperado:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function mapQuinielaToRaffleNumber(
  quinielaNumber: number,
  totalNumbers: number
): number {
  if (totalNumbers <= 100) {
    const lastTwo = quinielaNumber % 100;
    return lastTwo === 0 ? totalNumbers : lastTwo;
  }

  if (totalNumbers <= 1000) {
    const lastThree = quinielaNumber % 1000;
    return lastThree === 0 ? totalNumbers : lastThree;
  }

  return Math.min(quinielaNumber, totalNumbers);
}
