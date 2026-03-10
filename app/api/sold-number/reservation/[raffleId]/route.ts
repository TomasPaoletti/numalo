import { NextRequest, NextResponse } from "next/server";

import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";
import { PrismaSoldNumberRepository } from "@/backend/context/sold-numbers/infrastructure/database/sold-numbers.prisma-repository";

import { CustomError } from "@/backend/shared/errors";

import {
  DeleteReservationUseCase,
  GetReservationUseCase,
} from "@/backend/context/sold-numbers/application/use-case";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ raffleId: string }> }
) {
  try {
    const { raffleId } = await params;
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId || sessionId === "undefined") {
      return NextResponse.json(
        { error: "Session ID requerido" },
        { status: 400 }
      );
    }

    const soldNumbersRepository = new PrismaSoldNumberRepository();
    const raffleRepository = new PrismaRaffleRepository();
    const getActiveReservationUseCase = new GetReservationUseCase(
      soldNumbersRepository,
      raffleRepository
    );

    const reservation = await getActiveReservationUseCase.execute({
      raffleId,
      sessionId,
    });

    if (!reservation) {
      return NextResponse.json(null);
    }

    return NextResponse.json(reservation);
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ raffleId: string }> }
) {
  try {
    const { raffleId } = await params;

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId || sessionId === "undefined") {
      console.log("entrooooo");
      return NextResponse.json(
        { error: "Session ID requerido" },
        { status: 400 }
      );
    }

    const soldNumbersRepository = new PrismaSoldNumberRepository();
    const raffleRepository = new PrismaRaffleRepository();
    const deleteReservationUseCase = new DeleteReservationUseCase(
      soldNumbersRepository,
      raffleRepository
    );

    await deleteReservationUseCase.execute({
      raffleId,
      sessionId,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
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
