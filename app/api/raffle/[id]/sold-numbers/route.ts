import { NextRequest, NextResponse } from "next/server";

import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import { GetRaffleNumbersUseCase } from "@/backend/context/sold-numbers/application/use-case";
import { PrismaSoldNumberRepository } from "@/backend/context/sold-numbers/infrastructure/database/sold-numbers.prisma-repository";

import { CustomError } from "@/backend/shared/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const raffleRepository = new PrismaRaffleRepository();
    const soldNumbersRepository = new PrismaSoldNumberRepository();
    const getRaffleNumbersUseCase = new GetRaffleNumbersUseCase(
      raffleRepository,
      soldNumbersRepository
    );

    const raffleNumbers = await getRaffleNumbersUseCase.execute(id);

    return NextResponse.json(raffleNumbers);
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
