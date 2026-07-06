import { NextRequest, NextResponse } from "next/server";

import {
  DrawTrigger,
  RaffleStatus,
  ReservationStatus,
} from "@/app/generated/prisma/enums";

import prisma from "@/lib/prisma";

import { getTodayArgentina } from "@/backend/shared/utils/yesterday-argentina";

import { closeRaffle } from "@/backend/shared/utils/close-raffle";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.soldNumber.deleteMany({
      where: {
        status: ReservationStatus.RESERVED,
        reservedUntil: { lt: new Date() },
      },
    });

    const { start, end } = getTodayArgentina();

    const raffles = await prisma.raffle.findMany({
      where: {
        status: RaffleStatus.ACTIVE,
        drawTrigger: DrawTrigger.FECHA_FIJA,
        drawDate: { gte: start, lte: end },
      },
      include: {
        company: {
          include: {
            users: { select: { email: true }, take: 1 },
          },
        },
      },
    });

    const rafflesToClose = raffles.map((r) => ({
      ...r,
      numberPrice: Number(r.numberPrice),
    }));

    if (rafflesToClose.length === 0) {
      return NextResponse.json({ closed: 0 });
    }

    const results = await Promise.allSettled(
      rafflesToClose.map((raffle) =>
        closeRaffle({ raffle, company: raffle.company })
      )
    );

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      console.error(
        `[Cron] ${failed.length} rifa(s) fallaron:`,
        failed.map((r) => (r as PromiseRejectedResult).reason)
      );
    }

    return NextResponse.json({
      closed: rafflesToClose.length - failed.length,
      failed: failed.length,
    });
  } catch (error) {
    console.error("[Cron] Error inesperado:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
