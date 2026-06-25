import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";
import { GetPendingNumbersWithPayment } from "@/backend/context/sold-numbers/application/use-case";
import { PrismaSoldNumberRepository } from "@/backend/context/sold-numbers/infrastructure/database/sold-numbers.prisma-repository";
import { CustomError } from "@/backend/shared/errors";
import { requireAuth } from "@/backend/shared/guards/auth.guard";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { companyId } = await requireAuth();

    const { id } = await params;

    const raffle = await prisma.raffle.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!raffle || raffle.companyId !== companyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const raffleRepository = new PrismaRaffleRepository();
    const soldNumbersRepository = new PrismaSoldNumberRepository();
    const getPendingNumbers = new GetPendingNumbersWithPayment(
      raffleRepository,
      soldNumbersRepository
    );

    const pendingNumbers = await getPendingNumbers.execute(id);

    return NextResponse.json(pendingNumbers);
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
