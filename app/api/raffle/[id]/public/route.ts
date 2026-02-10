import { NextRequest, NextResponse } from "next/server";

import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import { GetRaffleByIdPublicUseCase } from "@/backend/context/raffle/application/use-case/get-raffle-by-id-public.use-case";
import { PrismaSoldNumberRepository } from "@/backend/context/sold-numbers/infrastructure/database/sold-numbers.prisma-repository";
import { CustomError } from "@/backend/shared/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const raffleRepository = new PrismaRaffleRepository();
    const soldNumberRepository = new PrismaSoldNumberRepository();
    const getRaffleByIdPublicUseCase = new GetRaffleByIdPublicUseCase(
      raffleRepository,
      soldNumberRepository
    );

    const raffle = await getRaffleByIdPublicUseCase.execute({
      raffleId: id,
    });

    return NextResponse.json(raffle);
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
