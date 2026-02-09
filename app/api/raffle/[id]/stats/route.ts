import { NextRequest, NextResponse } from "next/server";

import { GetRaffleStatsByIdUseCase } from "@/backend/context/raffle/application/use-case/get-raffle-stats-by-ud.use-case";
import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import { PrismaSoldNumberRepository } from "@/backend/context/sold-numbers/infrastructure/database/sold-numbers.prisma-repository";

import { CustomError } from "@/backend/shared/errors";

import { requireAuth } from "@/backend/shared/guards/auth.guard";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { companyId } = await requireAuth();

    if (!companyId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;

    const raffleRepository = new PrismaRaffleRepository();
    const soldNumberRepository = new PrismaSoldNumberRepository();
    const getRaffleStatsByIdUseCase = new GetRaffleStatsByIdUseCase(
      raffleRepository,
      soldNumberRepository
    );

    const raffle = await getRaffleStatsByIdUseCase.execute({
      raffleId: id,
      companyId,
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
