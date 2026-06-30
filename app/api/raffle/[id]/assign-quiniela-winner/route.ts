import {
  DrawMethod,
  RaffleStatus,
  ReservationStatus,
} from "@/app/generated/prisma/enums";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

import {
  CustomError,
  NotFoundError,
  ValidationError,
} from "@/backend/shared/errors";
import { ForbiddenError } from "@/backend/shared/errors/custom-error";
import { requireAuth } from "@/backend/shared/guards/auth.guard";
import { mapQuinielaToRaffleNumber } from "@/backend/shared/utils/map-quiniela-to-raffle-number";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { companyId } = await requireAuth();

    if (!companyId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { quinielaNumbers } = body as { quinielaNumbers: number[] };

    if (!Array.isArray(quinielaNumbers) || quinielaNumbers.length === 0) {
      throw new ValidationError("Debe proveer al menos un número de quiniela");
    }

    for (const n of quinielaNumbers) {
      if (typeof n !== "number" || !Number.isInteger(n) || n < 0 || n > 9999) {
        throw new ValidationError(
          "Cada número de quiniela debe ser un entero entre 0 y 9999"
        );
      }
    }

    const raffle = await prisma.raffle.findUnique({
      where: { id },
      include: {
        winners: true,
        company: {
          include: {
            users: { select: { email: true }, take: 1 },
          },
        },
      },
    });

    if (!raffle) throw new NotFoundError("Rifa no encontrada");
    if (raffle.companyId !== companyId)
      throw new ForbiddenError("No tienes permisos sobre esta rifa");
    if (raffle.drawMethod !== DrawMethod.QUINIELA_NACIONAL) {
      throw new ValidationError(
        "Esta rifa no usa el método de quiniela nacional"
      );
    }
    if (
      raffle.status !== RaffleStatus.ACTIVE &&
      raffle.status !== RaffleStatus.FINISHED
    ) {
      throw new ValidationError(
        "Solo se puede asignar el ganador a una rifa activa o cerrada"
      );
    }
    if (raffle.winners.length > 0) {
      throw new ValidationError("Esta rifa ya tiene ganadores asignados");
    }
    if (quinielaNumbers.length !== raffle.winnersCount) {
      throw new ValidationError(
        `Esta rifa tiene ${raffle.winnersCount} ganador(es). Debe proveer exactamente ${raffle.winnersCount} número(s) de quiniela`
      );
    }

    const winners = await Promise.all(
      quinielaNumbers.map(async (quinielaNumber, index) => {
        const mappedNumber = mapQuinielaToRaffleNumber(
          quinielaNumber,
          raffle.totalNumbers
        );

        const soldNumber = await prisma.soldNumber.findFirst({
          where: {
            raffleId: id,
            number: mappedNumber,
            status: ReservationStatus.SOLD,
          },
          include: { payment: true },
        });

        return {
          position: index + 1,
          quinielaNumber,
          mappedNumber,
          winnerName: soldNumber?.payment?.payerName ?? null,
          winnerEmail: soldNumber?.payment?.payerEmail ?? null,
          winnerPhone: soldNumber?.payment?.payerPhone ?? null,
        };
      })
    );

    await prisma.$transaction([
      ...winners.map((w) =>
        prisma.raffleWinner.create({
          data: {
            position: w.position,
            number: w.mappedNumber,
            name: w.winnerName,
            email: w.winnerEmail,
            phone: w.winnerPhone,
            raffleId: id,
          },
        })
      ),
      prisma.raffle.update({
        where: { id },
        data: {
          status: RaffleStatus.FINISHED,
          finishedAt: raffle.finishedAt ?? new Date(),
        },
      }),
    ]);

    return NextResponse.json({ winners });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
