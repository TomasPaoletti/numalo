import { NextRequest, NextResponse } from "next/server";

import { CreateReservationUseCase } from "@/backend/context/sold-numbers/application/use-case";
import { PrismaSoldNumberRepository } from "@/backend/context/sold-numbers/infrastructure/database/sold-numbers.prisma-repository";

import { CustomError } from "@/backend/shared/errors";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const RESERVATION_LIMIT = 5;
const RESERVATION_WINDOW_MS = 10 * 60 * 1000;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, retryAfterMs } = rateLimit(
    `reservation:${ip}`,
    RESERVATION_LIMIT,
    RESERVATION_WINDOW_MS
  );

  if (!allowed) {
    return NextResponse.json(
      {
        error:
          "Demasiados intentos. Esperá unos minutos antes de volver a intentar.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
      }
    );
  }

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
