import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/backend/shared/guards/auth.guard";

import { DeleteRaffleUseCase } from "@/backend/context/raffle/application/use-case/delete-raffle.use-case";
import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import { CustomError } from "@/backend/shared/errors";

export async function DELETE(
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
    const deleteRaffleUseCase = new DeleteRaffleUseCase(raffleRepository);

    await deleteRaffleUseCase.execute(id, companyId);

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
