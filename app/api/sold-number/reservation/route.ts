import { NextRequest, NextResponse } from "next/server";

import { CreateReservationUseCase } from "@/backend/context/sold-numbers/application/use-case";
import { PrismaSoldNumberRepository } from "@/backend/context/sold-numbers/infrastructure/database/sold-numbers.prisma-repository";

import { CustomError } from "@/backend/shared/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { raffleId, numbers, sessionId } = body;

    const soldNumbersRepository = new PrismaSoldNumberRepository();
    const createReservationUseCase = new CreateReservationUseCase(
      soldNumbersRepository
    );

    const result = await createReservationUseCase.execute({
      raffleId,
      numbers,
      sessionId,
    });

    return NextResponse.json(result);
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
